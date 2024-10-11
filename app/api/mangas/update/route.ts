import { updateMangas } from "@/script";


export const POST = () => {
  try {
    updateMangas();
  } catch (error) {
    return Response.json(
      { message: error },
      { status: 500 }
    )
  }
  return Response.json(
    { message: 'mangas are updating' },
    { status: 201 }
  );
};
