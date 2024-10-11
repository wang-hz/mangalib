import { MANGAS_DIR } from "@/config";
import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises';
import * as Path from 'path';
import { v4 } from 'uuid';

const prisma = new PrismaClient();

const getMangaPaths = async (mangaDir: string) => {
  const mangaPaths: string[] = [];
  const stack = [mangaDir];
  while (stack.length > 0) {
    const cwd = stack.pop();
    if (!cwd) {
      break;
    }
    const filenames = await fs.readdir(cwd);
    for (const filename of filenames) {
      const fullPath = Path.join(cwd, filename);
      const stats = await fs.stat(fullPath);
      if (stats.isDirectory()) {
        stack.push(fullPath);
      } else if (Path.extname(filename) === '.zip') {
        mangaPaths.push(fullPath);
      }
    }
  }
  return mangaPaths;
};

const createMangaIfNotExists = async (path: string) => {
  return prisma.manga
    .findUnique({ where: { path } })
    .then(async (manga) => {
      if (!!manga) {
        return;
      }
      const uuid = v4();
      await prisma.manga.create({ data: { uuid, path, title: Path.parse(path).name } });
    });
};

export const updateMangas = () => {
  getMangaPaths(MANGAS_DIR)
    .then((mangaPaths) => mangaPaths
      .forEach(async (mangaPath) => await createMangaIfNotExists(mangaPath)));
};

export const findMangasByPage = async (skip: number, take: number) => {
  const query = { skip, take, where: undefined };
  return prisma.$transaction([
    prisma.manga.count({ where: query.where }),
    prisma.manga.findMany(query)
  ]);
};
