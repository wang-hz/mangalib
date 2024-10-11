import { MANGAS_DIR } from "@/config";
import { PrismaClient } from '@prisma/client'
import fs from 'fs-extra';
import * as Path from 'path';
import { v4 } from 'uuid';

const prisma = new PrismaClient();

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
  getMangaPaths(MANGAS_DIR).forEach(async (mangaPath) => await createMangaIfNotExists(mangaPath));
};

export const findMangasByPage = async (skip: number, take: number) => {
  const query = { skip, take, where: undefined };
  return prisma.$transaction([
    prisma.manga.count({ where: query.where }),
    prisma.manga.findMany(query)
  ]);
};
