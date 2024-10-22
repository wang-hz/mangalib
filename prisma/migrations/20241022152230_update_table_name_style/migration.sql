ALTER TABLE "manga"
    RENAME TO "manga_tmp";
ALTER TABLE "manga_tmp"
    RENAME TO "Manga";
ALTER TABLE "image"
    RENAME TO "image_tmp";
ALTER TABLE "image_tmp"
    RENAME TO "Image";
ALTER TABLE "updateRecord"
    RENAME TO "updateRecord_tmp";
ALTER TABLE "updateRecord_tmp"
    RENAME TO "UpdateRecord";

-- RedefineIndex
DROP INDEX "image_mangaUuid_idx";
CREATE INDEX "Image_mangaUuid_idx" ON "Image"("mangaUuid");

-- RedefineIndex
DROP INDEX "image_filename_key";
CREATE UNIQUE INDEX "Image_filename_key" ON "Image"("filename");

-- RedefineIndex
DROP INDEX "image_uuid_key";
CREATE UNIQUE INDEX "Image_uuid_key" ON "Image"("uuid");

-- RedefineIndex
DROP INDEX "manga_path_key";
CREATE UNIQUE INDEX "Manga_path_key" ON "Manga"("path");

-- RedefineIndex
DROP INDEX "manga_uuid_key";
CREATE UNIQUE INDEX "Manga_uuid_key" ON "Manga"("uuid");

-- RedefineIndex
DROP INDEX "updateRecord_uuid_key";
CREATE UNIQUE INDEX "UpdateRecord_uuid_key" ON "UpdateRecord"("uuid");
