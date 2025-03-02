import { UpdateRecordStatus } from "@/app/models";
import { getImages, getMangaPaths, parseMangaInfo } from "@/app/util";
import { MANGAS_DIR } from "@/config";
import { deleteImages } from "@/services/image";
import { createTagIfNotExist } from "@/services/tag";
import { createUpdateRecord, updateUpdateRecord } from "@/services/updateRecord";
import { Manga, Prisma } from "@prisma/client";
import fs from "fs-extra";
import { v4 } from "uuid";
import { prisma } from "./base";

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

export const updateManga = async ({ uuid, title, originalTitle, fullTitle }: {
  uuid: string,
  title?: string,
  originalTitle?: string,
  fullTitle?: string,
}) => {
  const manga = await prisma.manga.findUnique({ where: { uuid } });
  if (!manga) {
    return false;
  }
  await prisma.manga.update(({
    where: { uuid },
    data: {
      title: title ?? Prisma.skip,
      originalTitle: originalTitle ?? Prisma.skip,
      fullTitle: fullTitle ?? Prisma.skip,
      updatedAt: new Date(Date.now()),
    },
  }));
  return true;
};

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

export const addTag = async (mangaUuid: string, tagName: string, tagType: string | null) => {
  const tag = await createTagIfNotExist(tagName, tagType);
  let mangaTag = await prisma.mangaTag.findUnique({
    where: {
      mangaUuid_tagUuid: {
        mangaUuid: mangaUuid,
        tagUuid: tag.uuid,
      },
    },
    select: { tagUuid: true },
  });
  if (!mangaTag) {
    mangaTag = await prisma.mangaTag.create({
      data: { mangaUuid, tagUuid: tag.uuid },
      select: { tagUuid: true },
    });
  }
  return mangaTag;
};

export const deleteTag = async (mangaUuid: string, tagUuid: string) => {
  return prisma.mangaTag.delete({ where: { mangaUuid_tagUuid: { mangaUuid, tagUuid } } });
};
