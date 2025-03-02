import { ApiError } from "@/app/errors";
import { deleteTag } from "@/services/manga";

export const DELETE = async (
  _: Request,
  { params }: { params: { mangaUuid: string, tagUuid: string } },
) => deleteTag(params.mangaUuid, params.tagUuid)
  .then(() => new Response(null, { status: 204 }))
  .catch(error => {
    if (error instanceof ApiError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: 'Unexpected error' }, { status: 500 });
  });
