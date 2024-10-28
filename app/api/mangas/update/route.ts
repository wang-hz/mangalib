import { UpdateRecordStatus } from "@/app/models";
import { findLastUpdateRecord, updateMangas } from "@/app/script";

export const GET = async () => {
  const updateRecord = await findLastUpdateRecord();
  return Response.json(
    { status: updateRecord },
    { status: 200 }
  );
};

export const POST = async () => {
  const updateRecord = await findLastUpdateRecord();
  if (updateRecord != null && updateRecord.status !== UpdateRecordStatus.ALL_UPDATED.toString()) {
    return Response.json(
      { message: 'update task of mangas is already running' },
      { status: 409 }
    );
  }
  try {
    updateMangas();
  } catch (error) {
    return Response.json(
      { message: error },
      { status: 500 }
    )
  }
  return Response.json(
    { message: 'update task of mangas started' },
    { status: 202 }
  );
};
