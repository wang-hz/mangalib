import { ApiError } from "@/app/errors";
import { addTag } from "@/services/manga";

export const POST = async (
  request: Request,
  { params }: { params: { mangaUuid: string } },
) => request.json()
  .then(({ name, type }: { name: string, type: string | null }) => addTag(params.mangaUuid, name, type))
  .then(data => Response.json(data, { status: 201 }))
  .catch(error => {
    if (error instanceof ApiError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: 'Unexpected error' }, { status: 500 });
  });
