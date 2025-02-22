import { TagModel, UpdateRecordStatus } from "@/app/models";
import { getImages, getMangaPaths, parseMangaInfo } from "@/app/util";
import { CACHE_DIR, MANGAS_DIR } from "@/config";
import { Manga, PrismaClient } from '@prisma/client'
import fs from 'fs-extra';
import * as Path from 'path';
import { v4 } from 'uuid';

const prisma = new PrismaClient();

const createOrUpdateManga = async (path: string) => {
  return prisma.manga
    .findUnique({ where: { path } })
    .then(async (manga) => {
      if (!manga) {
        const uuid = v4();
        const fileModifiedTime = new Date(fs.statSync(path).mtime.getTime());
        const images = getImages(path);
        const coverFilename = images[0].filename;
        const {
          title, fullTitle, originalTitle, artist,
          group, parody, event, tagsJson
        } = parseMangaInfo(path);
        const mangaTags = [];
        if (artist) {
          const tag = await createTagIfNotExist(artist, 'artist');
          mangaTags.push({ tagUuid: tag.uuid });
        }
        if (group) {
          const tag = await createTagIfNotExist(group, 'group');
          mangaTags.push({ tagUuid: tag.uuid });
        }
        if (parody) {
          const tag = await createTagIfNotExist(parody, 'parody');
          mangaTags.push({ tagUuid: tag.uuid });
        }
        if (event) {
          const tag = await createTagIfNotExist(event, 'event');
          mangaTags.push({ tagUuid: tag.uuid });
        }
        if (tagsJson) {
          const names = JSON.parse(tagsJson);
          for (const name of names) {
            const tag = await createTagIfNotExist(name, null);
            mangaTags.push({ tagUuid: tag.uuid });
          }
        }
        const manga: Manga = await prisma.manga.create({
          data: {
            uuid, path, fileModifiedTime, title, fullTitle, originalTitle, coverFilename,
            images: { createMany: { data: images } },
            mangaTags: { createMany: { data: mangaTags } }
          }
        });
        return manga;
      }
      if (manga.fileModifiedTime === new Date(fs.statSync(manga.path).mtime.getTime())) {
        return manga;
      }
      await deleteImages(manga.uuid);
      const images = getImages(manga.path);
      return prisma.manga.update({
        where: { uuid: manga.uuid },
        data: {
          coverFilename: images[0].filename,
          updatedAt: new Date(Date.now()),
          images: { createMany: { data: images } }
        }
      });
    });
};

export const updateManga = async ({ uuid, title, originalTitle, fullTitle, tags }: {
  uuid: string,
  title: string,
  originalTitle: string,
  fullTitle: string,
  tags: Array<TagModel>
}) => {
  const manga = await prisma.manga.findUnique({ where: { uuid } });
  if (!manga) {
    return false;
  }
  for (const tag of tags) {
    const newTag = await createTagIfNotExist(tag.name, tag.type);
    const mangaTag = await prisma.mangaTag.findUnique({
      where: {
        mangaUuid_tagUuid: {
          mangaUuid: manga.uuid,
          tagUuid: newTag.uuid
        }
      }
    });
    if (!mangaTag) {
      await prisma.mangaTag.create({ data: { mangaUuid: manga.uuid, tagUuid: newTag.uuid } });
    }
  }
  await prisma.manga.update(({
    where: { uuid },
    data: {
      title, originalTitle, fullTitle,
      updatedAt: new Date(Date.now()),
    }
  }));
  return true;
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
    data: {
      progress, total, status,
      updatedAt: new Date(Date.now())
    },
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
      await prisma.$transaction([
        prisma.manga.delete({ where: { uuid: manga.uuid } }),
        prisma.mangaTag.deleteMany({ where: { mangaUuid: manga.uuid } })
      ]);
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

export const deleteImages = async (mangaUuid: string) => {
  const images = await prisma.image.findMany({ where: { mangaUuid } });
  images.map((image) => image.filename)
    .map((filename) => Path.join(CACHE_DIR, filename))
    .filter((image_path) => fs.existsSync(image_path))
    .forEach((image_path) => fs.unlinkSync(image_path));
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

const createTagIfNotExist = async (name: string, type: string | null) => {
  return prisma.tag.findFirst({ where: { name, type } })
    .then((tag) => {
      if (!!tag) {
        return tag;
      }
      return prisma.tag.create({ data: { uuid: v4(), name, type } });
    });
};

export const findTags = async (mangaUuid: string) => {
  const mangaTags = await prisma.mangaTag.findMany({ where: { mangaUuid } });
  const tags = [];
  for (const mangaTag of mangaTags) {
    const tag = await prisma.tag.findUnique({
      select: { uuid: true, name: true, type: true },
      where: { uuid: mangaTag.tagUuid }
    });
    tags.push(tag);
  }
  return tags;
};
