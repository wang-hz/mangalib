import { ApiError } from "@/app/errors";
import { readImage } from "@/services/image";
import { fileTypeFromBuffer } from "file-type";

export const GET = async (
  _: Request,
  { params }: { params: { filename: string } },
) => readImage(params.filename)
  .then(async image => {
    if (!image) {
      throw new ApiError('Image not found', 404);
    }
    const fileType = await fileTypeFromBuffer(image);
    if (!fileType) {
      throw new ApiError('Unknown file type', 500);
    }
    return new Response(image, { headers: { 'Content-Type': fileType.mime } });
  })
  .catch(error => {
    if (error instanceof ApiError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: 'Unexpected error' }, { status: 500 });
  });
