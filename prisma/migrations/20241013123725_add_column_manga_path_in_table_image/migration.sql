/*
  Warnings:

  - Added the required column `mangaPath` to the `image` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys= ON;
PRAGMA foreign_keys= OFF;
CREATE TABLE "new_image"
(
    "pid"       INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid"      TEXT    NOT NULL,
    "mangaUuid" TEXT    NOT NULL,
    "entryName" TEXT    NOT NULL,
    "mangaPath" TEXT    NOT NULL,
    "filename"  TEXT    NOT NULL
);
INSERT INTO "new_image" ("entryName", "filename", "mangaUuid", "pid", "uuid", "mangaPath")
SELECT image."entryName", image."filename", image."mangaUuid", image."pid", "image"."uuid", "manga"."path"
FROM "image"
         LEFT JOIN "manga" ON "image"."mangaUuid" = "manga"."uuid";
DROP TABLE "image";
ALTER TABLE "new_image"
    RENAME TO "image";
CREATE UNIQUE INDEX "image_uuid_key" ON "image" ("uuid");
CREATE UNIQUE INDEX "image_filename_key" ON "image" ("filename");
CREATE INDEX "image_mangaUuid_idx" ON "image" ("mangaUuid");
PRAGMA foreign_keys= ON;
PRAGMA defer_foreign_keys= OFF;
