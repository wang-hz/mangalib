import { MANGAS_DIR } from "@/config";
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
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        stack.push(fullPath);
      } else if (Path.extname(filename) === '.zip') {
        mangaPaths.push(fullPath);
      }
    });
  }
  return mangaPaths;
};

const createOrUpdateManga = async (path: string) => {
  return prisma.manga
    .findUnique({ where: { path } })
    .then(async (manga) => {
      if (!!manga) {
        if (Number(manga.fileModifiedTime) === fs.statSync(manga.path).mtime.getTime()) {
          return;
        }
        await deleteImages(manga.uuid);
        await createImages(manga.uuid);
      }
      const uuid = v4();
      const info = parseMangaInfo(path);
      await prisma.manga.create({ data: { uuid, path, fileModifiedTime: fs.statSync(path).mtime.getTime(), ...info } });
      await createImages(uuid);
    });
};

export const updateMangas = () => {
  prisma.manga.findMany()
    .then((mangas) => mangas.forEach(async (manga) => {
      if (!fs.existsSync(manga.path)) {
        await prisma.manga.delete({ where: { uuid: manga.uuid } });
        return;
      }
      await prisma.manga.update({
        where: { uuid: manga.uuid },
        data: parseMangaInfo(manga.path)
      });
    }));
  getMangaPaths(MANGAS_DIR).forEach(async (mangaPath) => await createOrUpdateManga(mangaPath));
};

export const findMangasByPage = async (skip: number, take: number) => {
  const query = { skip, take, where: undefined };
  return prisma.$transaction([
    prisma.manga.count({ where: query.where }),
    prisma.manga.findMany(query)
  ]);
};

export const findManga = async (uuid: string) => {
  return prisma.manga.findUnique({ where: { uuid } });
};

export const createImages = async (mangaUuid: string) => {
  return findManga(mangaUuid)
    .then((manga) => {
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
          const filename = `${uuid}${extname}`
          return { uuid, mangaUuid, entryName, filename };
        });
      return prisma.image.createMany({ data });
    });
};

export const deleteImages = async (mangaUuid: string) => {
  return prisma.image.deleteMany({ where: { mangaUuid } });
};
