-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_image" (
    "pid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "manga_uuid" TEXT NOT NULL,
    "entry_name" TEXT NOT NULL,
    "manga_path" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_image" ("entry_name", "filename", "manga_path", "manga_uuid", "pid", "uuid") SELECT "entry_name", "filename", "manga_path", "manga_uuid", "pid", "uuid" FROM "image";
DROP TABLE "image";
ALTER TABLE "new_image" RENAME TO "image";
CREATE UNIQUE INDEX "image_uuid_key" ON "image"("uuid");
CREATE UNIQUE INDEX "image_filename_key" ON "image"("filename");
CREATE INDEX "image_manga_uuid_idx" ON "image"("manga_uuid");
CREATE TABLE "new_manga" (
    "pid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "cover_filename" TEXT,
    "title" TEXT,
    "original_title" TEXT,
    "full_title" TEXT,
    "artist" TEXT,
    "group" TEXT,
    "event" TEXT,
    "parody" TEXT,
    "tags" TEXT,
    "file_modified_time" BIGINT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_manga" ("artist", "cover_filename", "event", "file_modified_time", "full_title", "group", "original_title", "parody", "path", "pid", "tags", "title", "uuid") SELECT "artist", "cover_filename", "event", "file_modified_time", "full_title", "group", "original_title", "parody", "path", "pid", "tags", "title", "uuid" FROM "manga";
DROP TABLE "manga";
ALTER TABLE "new_manga" RENAME TO "manga";
CREATE UNIQUE INDEX "manga_uuid_key" ON "manga"("uuid");
CREATE UNIQUE INDEX "manga_path_key" ON "manga"("path");
CREATE TABLE "new_update_record" (
    "pid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "progress" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_update_record" ("pid", "progress", "status", "total", "uuid") SELECT "pid", "progress", "status", "total", "uuid" FROM "update_record";
DROP TABLE "update_record";
ALTER TABLE "new_update_record" RENAME TO "update_record";
CREATE UNIQUE INDEX "update_record_uuid_key" ON "update_record"("uuid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
