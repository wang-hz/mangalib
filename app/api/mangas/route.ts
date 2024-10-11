import { findMangasByPage } from "@/script";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const pageIndex = parseInt(searchParams.get('pageIndex') ?? '');
  const pageSize = parseInt(searchParams.get('pageSize') ?? '');
  const errors: string[] = [];
  if (isNaN(pageIndex)) {
    errors.push('pageIndex must be an integer');
  }
  if (isNaN(pageSize)) {
    errors.push('pageSize must be an integer');
  }
  if (errors.length > 0) {
    return Response.json(
      {
        message: errors.join('; ')
      },
      { status: 400 }
    );
  }
  return findMangasByPage((pageIndex - 1) * pageSize, pageSize)
    .then(([total, mangas]) => Response.json(
      {
        total,
        items: mangas.map((manga) => {
          return { uuid: manga.uuid, title: manga.title };
        })
      },
      { status: 200 }
    ));
};
