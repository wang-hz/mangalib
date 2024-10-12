import { findManga } from "@/script";

export const GET = async (
  _: Request,
  { params }: { params: { uuid: string } }
) => {
  return findManga(params.uuid)
    .then((manga) => {
      if (!manga) {
        return Response.json(
          { message: 'manga not found' },
          { status: 404 }
        )
      }
      return Response.json(
        {
          title: manga.title,
          originalTitle: manga.originalTitle,
          fullTitle: manga.fullTitle,
          artist: manga.artist,
          group: manga.group,
          event: manga.event,
          parody: manga.parody,
          tags: JSON.parse(manga.tags ?? '[]')
        },
        { status: 200 }
      );
    })
    .catch((error) => Response.json(
      { message: error.message },
      { status: 500 }
    ));
};
