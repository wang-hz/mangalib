/*
  Warnings:

  - You are about to drop the column `artist` on the `manga` table. All the data in the column will be lost.
  - You are about to drop the column `event` on the `manga` table. All the data in the column will be lost.
  - You are about to drop the column `group` on the `manga` table. All the data in the column will be lost.
  - You are about to drop the column `parody` on the `manga` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `manga` table. All the data in the column will be lost.

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
    "file_modified_time" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_manga" ("cover_filename", "created_at", "file_modified_time", "full_title", "original_title", "path", "pid", "title", "updated_at", "uuid") SELECT "cover_filename", "created_at", "file_modified_time", "full_title", "original_title", "path", "pid", "title", "updated_at", "uuid" FROM "manga";
DROP TABLE "manga";
ALTER TABLE "new_manga" RENAME TO "manga";
CREATE UNIQUE INDEX "manga_uuid_key" ON "manga"("uuid");
CREATE UNIQUE INDEX "manga_path_key" ON "manga"("path");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
