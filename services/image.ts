import { CACHE_DIR } from "@/config";
import { prisma } from "@/services/base";
import AdmZip from "adm-zip";
import fs from "fs-extra";
import Path from "path";

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

export const readImage = async (filename: string) => {
  const imagePath = Path.join(CACHE_DIR, filename);
  if (fs.existsSync(imagePath)) {
    return fs.readFileSync(imagePath);
  }
  const image = await findImage(filename);
  if (!image) {
    return null;
  }
  const data = new AdmZip(image.mangaPath).getEntry(image.entryName)?.getData();
  if (!data) {
    return null;
  }
  fs.writeFileSync(imagePath, data);
  return data;
};
