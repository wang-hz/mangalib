import { prisma } from "@/services/base";
import { v4 } from "uuid";

export const createTagIfNotExist = async (name: string, type: string | null) => {
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
