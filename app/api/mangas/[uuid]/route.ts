import { findManga, findTags, updateManga } from "@/app/script";

export const GET = async (
  _: Request,
  { params }: { params: { uuid: string } }
) => {
  return findManga(params.uuid)
    .then(async (manga) => {
      if (!manga) {
        return Response.json(
          { message: 'manga not found' },
          { status: 404 }
        )
      }
      const tags = await findTags(manga.uuid);
      return Response.json(
        {
          tags,
          path: manga.path,
          coverFilename: manga.coverFilename,
          title: manga.title,
          originalTitle: manga.originalTitle,
          fullTitle: manga.fullTitle,
          fileModifiedTime: manga.fileModifiedTime,
          createdAt: manga.createdAt,
          updatedAt: manga.updatedAt
        },
        { status: 200 }
      );
    })
    .catch(error => Response.json(
      { message: error.message },
      { status: 500 }
    ));
};

export const PUT = async (
  request: Request,
  { params }: { params: { uuid: string } }
) => {
  return request.json()
    .then(async manga => {
      manga.uuid = params.uuid;
      return updateManga(manga)
        .then(updateSuccess =>
          updateSuccess ? new Response(null, { status: 204 }) : new Response(null, { status: 404 })
        );
    })
    .catch(error => Response.json(
      { message: error.message },
      { status: 500 }
    ));
};
