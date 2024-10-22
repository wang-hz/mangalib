-- CreateTable
CREATE TABLE "updateRecord" (
    "pid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "progress" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "updateRecord_uuid_key" ON "updateRecord"("uuid");
