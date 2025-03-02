import { ApiError } from "@/app/errors";
import { findMangasByPage } from "@/services/manga";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const pageIndex = parseInt(searchParams.get('pageIndex') ?? '');
  const pageSize = parseInt(searchParams.get('pageSize') ?? '');
  if (isNaN(pageIndex) || isNaN(pageSize)) {
    return new Response('Search param pageIndex or pageSize is invalid.', { status: 400 });
  }
  return findMangasByPage((pageIndex - 1) * pageSize, pageSize)
    .then(([total, mangas]) => Response.json({ total, items: mangas }))
    .catch(error => {
      if (error instanceof ApiError) {
        return Response.json({ message: error.message }, { status: error.status });
      }
      return Response.json({ message: 'Unexpected error' }, { status: 500 });
    });
};
