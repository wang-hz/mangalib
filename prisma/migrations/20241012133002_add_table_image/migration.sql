-- CreateTable
CREATE TABLE "image" (
    "pid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "mangaUuid" TEXT NOT NULL,
    "entryName" TEXT NOT NULL,
    "filename" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "image_uuid_key" ON "image"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "image_filename_key" ON "image"("filename");

-- CreateIndex
CREATE INDEX "image_mangaUuid_idx" ON "image"("mangaUuid");
