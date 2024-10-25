ALTER TABLE "Manga"
    RENAME TO "manga_tmp";
ALTER TABLE "manga_tmp"
    RENAME TO "manga";
ALTER TABLE "manga"
    RENAME COLUMN "coverFilename" TO "cover_filename";
ALTER TABLE "manga"
    RENAME COLUMN "originalTitle" TO "original_title";
ALTER TABLE "manga"
    RENAME COLUMN "fullTitle" TO "full_title";
ALTER TABLE "manga"
    RENAME COLUMN "fileModifiedTime" TO "file_modified_time";
DROP INDEX "Manga_path_key";
CREATE UNIQUE INDEX "manga_path_key" ON "manga" ("path");
DROP INDEX "Manga_uuid_key";
CREATE UNIQUE INDEX "manga_uuid_key" ON "manga" ("uuid");

ALTER TABLE "Image"
    RENAME TO "image_tmp";
ALTER TABLE "image_tmp"
    RENAME TO "image";
ALTER TABLE "image"
    RENAME COLUMN "mangaUuid" TO "manga_uuid";
ALTER TABLE "image"
    RENAME COLUMN "entryName" TO "entry_name";
ALTER TABLE "image"
    RENAME COLUMN "mangaPath" TO "manga_path";
DROP INDEX "Image_mangaUuid_idx";
CREATE INDEX "image_manga_uuid_idx" ON "image" ("manga_uuid");
DROP INDEX "Image_filename_key";
CREATE UNIQUE INDEX "image_filename_key" ON "image" ("filename");
DROP INDEX "Image_uuid_key";
CREATE UNIQUE INDEX "image_uuid_key" ON "image" ("uuid");

ALTER TABLE "UpdateRecord"
    RENAME TO "update_record";
DROP INDEX "UpdateRecord_uuid_key";
CREATE UNIQUE INDEX "update_record_uuid_key" ON "update_record" ("uuid");
