import { ApiError } from "@/app/errors";
import { TagModel } from "@/app/models";
import { addTag, deleteTag } from "@/services/manga";

export const POST = async (
  request: Request,
  { params }: { params: { uuid: string } }
) => {
  return request.json()
    .then((tag: TagModel) => addTag(params.uuid, tag.name, tag.type))
    .catch(error => Response.json(
      { message: error.message },
      { status: 500 },
    ));
};

export const DELETE = async (
  request: Request,
  { params }: { params: { uuid: string } }
) => {
  return request.json()
    .then((tag: TagModel) => {
      if (tag.uuid === undefined) {
        throw new ApiError('Tag UUID is required', 400);
      }
      return deleteTag(params.uuid, tag.uuid)
    })
    .catch(error => Response.json(
      { message: error.message },
      { status: error.status },
    ));
};
