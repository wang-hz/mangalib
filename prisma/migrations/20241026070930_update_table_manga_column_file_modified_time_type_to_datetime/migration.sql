/*
  Warnings:

  - You are about to alter the column `file_modified_time` on the `manga` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "file_modified_time" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_manga" ("artist", "cover_filename", "created_at", "event", "file_modified_time", "full_title", "group", "original_title", "parody", "path", "pid", "tags", "title", "updated_at", "uuid") SELECT "artist", "cover_filename", "created_at", "event", "file_modified_time", "full_title", "group", "original_title", "parody", "path", "pid", "tags", "title", "updated_at", "uuid" FROM "manga";
DROP TABLE "manga";
ALTER TABLE "new_manga" RENAME TO "manga";
CREATE UNIQUE INDEX "manga_uuid_key" ON "manga"("uuid");
CREATE UNIQUE INDEX "manga_path_key" ON "manga"("path");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
