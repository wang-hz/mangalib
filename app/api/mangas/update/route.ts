import { ApiError } from "@/app/errors";
import { UpdateRecordStatus } from "@/app/models";
import { updateMangas } from "@/services/manga";
import { findLastUpdateRecord } from "@/services/update-record";

export const GET = async () => findLastUpdateRecord()
  .then(updateRecord => Response.json({
    status: updateRecord?.status,
    progress: updateRecord?.progress,
    total: updateRecord?.total,
  }));

export const POST = async () => findLastUpdateRecord()
  .then(updateRecord => {
    if (updateRecord != null && updateRecord.status !== UpdateRecordStatus.ALL_UPDATED.toString()) {
      throw new ApiError('Update task of mangas is already running', 409);
    }
    updateMangas();
  })
  .catch(error => {
    if (error instanceof ApiError) {
      return Response.json({ message: error.message }, { status: error.status });
    }
    return Response.json({ message: 'Unexpected error' }, { status: 500 });
  });
