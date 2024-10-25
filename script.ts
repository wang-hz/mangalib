import { UpdateRecordStatus } from "@/app/models";
import { CACHE_DIR, MANGAS_DIR } from "@/config";
import { PrismaClient } from '@prisma/client'
import AdmZip from 'adm-zip';
import fs from 'fs-extra';
import * as Path from 'path';
import { v4 } from 'uuid';

const prisma = new PrismaClient();

const imageExtnames = ['.gif', '.jpg', 'jpeg', '.png', 'bmp'];

const parseArtistAndGroup = (artist: string | undefined) => {
  if (!artist) {
    return [undefined, undefined];
  }
  const matches = artist.match(/(?<first>.*?(?=( \(|$)))( \((?<second>.*?)\))?/);
  const first = matches?.groups?.first;
  const second = matches?.groups?.second;
  if (!matches || !second) {
    return [artist, undefined];
  }
  return [second, first];
};

const reverseString = (s: string | undefined) => {
  return s?.split('').reverse().join('');
};

const parseTags = (text: string | undefined) => {
  if (!text) {
    return '[]';
  }
  const tags = text.trim().split(' ').map(tag => tag.slice(1, -1));
  return JSON.stringify(tags);
};

const parseTitle = (title: string | undefined) => {
  if (!title) {
    return [undefined, undefined];
  }
  const trimmedTitle = title.trim();
  if (!trimmedTitle.includes('｜')) {
    return [trimmedTitle, trimmedTitle];
  }
  return trimmedTitle.split('｜').map(s => s.trim());
};

const parseMangaInfo = (mangaPath: string) => {
  const fullTitle = Path.basename(mangaPath, Path.extname(mangaPath));
  const matches1 = fullTitle.match(/(\((?<event>.*?)\) )?(\[(?<artist>.*?)] )(?<rest>.*)/);
  const event = matches1?.groups?.event;
  const [artist, group] = parseArtistAndGroup(matches1?.groups?.artist);
  const rest = matches1?.groups?.rest;
  const matches2 = reverseString(rest)?.match(/(?<tags>].*\[ )?(\)(?<parody>.*)\( )?(?<title>.*)/);
  const tags = parseTags(reverseString(matches2?.groups?.tags));
  const parody = reverseString(matches2?.groups?.parody);
  const [originalTitle, title] = parseTitle(reverseString(matches2?.groups?.title));
  return { title, fullTitle, originalTitle, artist, group, parody, event, tags };
};

const getMangaPaths = (mangaDir: string) => {
  const mangaPaths: string[] = [];
  const stack = [mangaDir];
  while (stack.length > 0) {
    const cwd = stack.pop();
    if (!cwd) {
      break;
    }
    fs.readdirSync(cwd).forEach((filename) => {
      const fullPath = Path.join(cwd, filename);
      try {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          stack.push(fullPath);
        } else if (Path.extname(filename) === '.zip') {
          mangaPaths.push(fullPath);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  return mangaPaths;
};

const createOrUpdateManga = async (path: string) => {
  return prisma.manga
    .findUnique({ where: { path } })
    .then(async (manga) => {
      if (!manga) {
        const uuid = v4();
        const fileModifiedTime = fs.statSync(path).mtime.getTime();
        const info = parseMangaInfo(path);
        const manga = await prisma.manga.create({
          data: { uuid, path, fileModifiedTime, ...info }
        });
        await createImages(manga.uuid);
        return manga;
      }
      if (Number(manga.fileModifiedTime) === fs.statSync(manga.path).mtime.getTime()) {
        return manga;
      }
      await deleteImages(manga.uuid);
      const images = await createImages(manga.uuid);
      if (images.length === 0) {
        throw new Error(`cannot create the images of the manga. mangaUuid=${manga.uuid}`);
      }
      images.sort((a, b) => {
        if (a.entryName > b.entryName) {
          return 1;
        } else if (a.entryName < b.entryName) {
          return -1;
        } else {
          return 0;
        }
      })
      return prisma.manga.update({
        where: { uuid: manga.uuid },
        data: { coverFilename: images[0].filename }
      });
    });
};

export const findLastUpdateRecord = async () =>
  prisma.updateRecord.findFirst({
    orderBy: { pid: 'desc' },
  });

const createUpdateRecord = async () =>
  prisma.updateRecord.create({
    data: {
      uuid: v4(),
      progress: 0,
      total: 0,
      status: UpdateRecordStatus.UPDATING
    }
  });

const updateUpdateRecord = async ({ uuid, progress, total, status }: {
  uuid: string,
  progress?: number,
  total?: number,
  status?: string
}) =>
  prisma.updateRecord.update({
    where: { uuid },
    data: { progress, total, status },
  });

export const updateMangas = async () => {
  let updateRecord = await createUpdateRecord();
  const mangas = await prisma.manga.findMany();
  updateRecord = await updateUpdateRecord({
    uuid: updateRecord.uuid,
    total: mangas.length,
    status: UpdateRecordStatus.UPDATING
  });
  for (const manga of mangas) {
    if (!fs.existsSync(manga.path)) {
      await prisma.manga.delete({ where: { uuid: manga.uuid } });
    }
    updateRecord = await updateUpdateRecord({
      uuid: updateRecord.uuid,
      progress: updateRecord.progress + 1,
    });
  }
  updateRecord = await updateUpdateRecord({
    uuid: updateRecord.uuid,
    progress: 0,
    total: 0,
    status: UpdateRecordStatus.CREATING
  });
  const mangaPaths = getMangaPaths(MANGAS_DIR);
  updateRecord = await updateUpdateRecord({
    uuid: updateRecord.uuid,
    total: mangaPaths.length
  });
  for (const mangaPath of mangaPaths) {
    try {
      await createOrUpdateManga(mangaPath);
    } catch (error) {
      console.error(error);
    }
    updateRecord = await updateUpdateRecord({
      uuid: updateRecord.uuid,
      progress: updateRecord.progress + 1
    });
  }
  await updateUpdateRecord({
    uuid: updateRecord.uuid,
    progress: 0,
    total: 0,
    status: UpdateRecordStatus.ALL_UPDATED
  });
};

export const findMangasByPage = async (skip: number, take: number) => {
  return prisma.$transaction([
    prisma.manga.count(),
    prisma.manga.findMany({
      skip, take,
      select: { uuid: true, fullTitle: true, coverFilename: true }
    })
  ]);
};

export const findManga = async (uuid: string) => {
  return prisma.manga.findUnique({ where: { uuid } });
};

export const createImages = async (mangaUuid: string) => {
  const manga = await findManga(mangaUuid);
  if (!manga) {
    throw new Error(`manga not found. mangaUuid=${mangaUuid}`);
  }
  const admZip = new AdmZip(manga.path);
  const data = admZip.getEntries()
    .filter((entry) => !entry.isDirectory && imageExtnames.includes(Path.extname(entry.name)))
    .map((entry) => {
      const uuid = v4();
      const entryName = entry.entryName;
      const extname = Path.extname(entryName);
      const filename = `${uuid}${extname}`;
      const mangaPath = manga.path;
      return { uuid, mangaUuid, entryName, filename, mangaPath };
    });
  const images = await prisma.image.createManyAndReturn({ data });
  await prisma.manga.update({
    where: { uuid: mangaUuid },
    data: { coverFilename: images[0].filename },
  });
  return images;
};

export const deleteImages = async (mangaUuid: string) => {
  const images = await prisma.image.findMany({ where: { mangaUuid } });
  images.map((image) => image.filename).forEach((filename) => fs.unlinkSync(Path.join(CACHE_DIR, filename)));
  return prisma.image.deleteMany({ where: { mangaUuid } });
};

export const findImages = async (mangaUuid: string) => {
  return prisma.image.findMany({
    select: { filename: true },
    where: { mangaUuid },
    orderBy: { entryName: 'asc' }
  });
};

export const findImage = async (filename: string) => {
  return prisma.image.findUnique({
    select: { mangaUuid: true, mangaPath: true, entryName: true },
    where: { filename }
  });
};
