import { ApiError } from "@/app/errors";
import { findManga, updateManga } from "@/services/manga";
import { findTags } from "@/services/tag";

export const GET = async (
  _: Request,
  { params }: { params: { mangaUuid: string } },
) => findManga(params.mangaUuid)
  .then(async manga => {
    if (!manga) {
      throw new ApiError('Manga not found', 404);
    }
    return findTags(manga.uuid)
      .then(tags => Response.json({
        tags,
        path: manga.path,
        coverFilename: manga.coverFilename,
        title: manga.title,
        originalTitle: manga.originalTitle,
        fullTitle: manga.fullTitle,
        fileModifiedTime: manga.fileModifiedTime,
        createdAt: manga.createdAt,
        updatedAt: manga.updatedAt
      }));
  })
  .catch(error => {
    if (error instanceof ApiError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: 'Unexpected error' }, { status: 500 });
  });

export const PATCH = async (
  request: Request,
  { params }: { params: { mangaUuid: string } },
) => request.json()
  .then(manga => {
    manga.uuid = params.mangaUuid;
    return updateManga(manga);
  })
  .then(updateSuccess =>
    updateSuccess ? new Response(null, { status: 204 }) : new Response(null, { status: 404 })
  )
  .catch(error => {
    if (error instanceof ApiError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: 'Unexpected error' }, { status: 500 });
  });
