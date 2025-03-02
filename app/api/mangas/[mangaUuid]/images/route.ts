import { ApiError } from "@/app/errors";
import { findImages } from "@/services/image";

export const GET = async (
  _: Request,
  { params }: { params: { mangaUuid: string } },
) => findImages(params.mangaUuid)
  .then(images => images.map(image => `/api/images/${image.filename}`))
  .then(urls => Response.json({ images: urls }, { status: 200 }))
  .catch(error => {
    if (error instanceof ApiError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: 'Unexpected error' }, { status: 500 });
  });
