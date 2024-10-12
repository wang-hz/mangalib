import { findImages } from "@/script";

export const GET = async (
  _: Request,
  { params }: { params: { uuid: string } }
) => {
  return findImages(params.uuid)
    .then((images) => Response.json(
      { images: images.map((image) => `/api/images/${image.filename}`) },
      { status: 200 }
    ))
    .catch((error) => Response.json(
      { message: error },
      { status: 500 }
    ));
};
