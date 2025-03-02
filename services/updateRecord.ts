import { UpdateRecordStatus } from "@/app/models";
import { prisma } from "@/services/base";
import { v4 } from "uuid";

export const findLastUpdateRecord = async () =>
  prisma.updateRecord.findFirst({
    orderBy: { pid: 'desc' },
  });

export const createUpdateRecord = async () =>
  prisma.updateRecord.create({
    data: {
      uuid: v4(),
      progress: 0,
      total: 0,
      status: UpdateRecordStatus.UPDATING
    }
  });

export const updateUpdateRecord = async ({ uuid, progress, total, status }: {
  uuid: string,
  progress?: number,
  total?: number,
  status?: string
}) =>
  prisma.updateRecord.update({
    where: { uuid },
    data: {
      progress, total, status,
      updatedAt: new Date(Date.now())
    },
  });
