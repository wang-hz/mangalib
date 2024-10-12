/*
  Warnings:

  - The primary key for the `image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `pid` on the `image` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - The primary key for the `manga` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `fileModifiedTime` on the `manga` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `pid` on the `manga` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_image" (
    "pid" BIGINT NOT NULL PRIMARY KEY,
    "uuid" TEXT NOT NULL,
    "mangaUuid" TEXT NOT NULL,
    "entryName" TEXT NOT NULL,
    "filename" TEXT NOT NULL
);
INSERT INTO "new_image" ("entryName", "filename", "mangaUuid", "pid", "uuid") SELECT "entryName", "filename", "mangaUuid", "pid", "uuid" FROM "image";
DROP TABLE "image";
ALTER TABLE "new_image" RENAME TO "image";
CREATE UNIQUE INDEX "image_uuid_key" ON "image"("uuid");
CREATE UNIQUE INDEX "image_filename_key" ON "image"("filename");
CREATE INDEX "image_mangaUuid_idx" ON "image"("mangaUuid");
CREATE TABLE "new_manga" (
    "pid" BIGINT NOT NULL PRIMARY KEY,
    "uuid" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT,
    "originalTitle" TEXT,
    "fullTitle" TEXT,
    "artist" TEXT,
    "group" TEXT,
    "event" TEXT,
    "parody" TEXT,
    "tags" TEXT,
    "fileModifiedTime" BIGINT
);
INSERT INTO "new_manga" ("artist", "event", "fileModifiedTime", "fullTitle", "group", "originalTitle", "parody", "path", "pid", "tags", "title", "uuid") SELECT "artist", "event", "fileModifiedTime", "fullTitle", "group", "originalTitle", "parody", "path", "pid", "tags", "title", "uuid" FROM "manga";
DROP TABLE "manga";
ALTER TABLE "new_manga" RENAME TO "manga";
CREATE UNIQUE INDEX "manga_uuid_key" ON "manga"("uuid");
CREATE UNIQUE INDEX "manga_path_key" ON "manga"("path");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
