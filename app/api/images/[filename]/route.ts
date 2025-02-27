import { CACHE_DIR } from "@/config";
import { findImage } from "@/services/image";
import AdmZip from "adm-zip";
import { fileTypeFromBuffer } from "file-type";
import fs from "fs-extra";
import * as Path from "path";

export const GET = async (
  _: Request,
  { params }: { params: { filename: string } }
) => {
  const image = await readImage(params.filename);
  if (!image) {
    return Response.json(
      { message: 'image not found' },
      { status: 404 }
    );
  }
  const fileType = await fileTypeFromBuffer(image);
  if (!fileType) {
    return Response.json(
      { message: 'unknown file type' },
      { status: 500 }
    );
  }
  const response = new Response(image);
  response.headers.set('content-type', fileType.mime);
  return response;
};

const readImage = async (filename: string) => {
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
