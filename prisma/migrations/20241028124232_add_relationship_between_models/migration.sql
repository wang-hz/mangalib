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
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "image_manga_uuid_fkey" FOREIGN KEY ("manga_uuid") REFERENCES "manga" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_image" ("created_at", "entry_name", "filename", "manga_path", "manga_uuid", "pid", "updated_at", "uuid") SELECT "created_at", "entry_name", "filename", "manga_path", "manga_uuid", "pid", "updated_at", "uuid" FROM "image";
DROP TABLE "image";
ALTER TABLE "new_image" RENAME TO "image";
CREATE UNIQUE INDEX "image_uuid_key" ON "image"("uuid");
CREATE UNIQUE INDEX "image_filename_key" ON "image"("filename");
CREATE INDEX "image_manga_uuid_idx" ON "image"("manga_uuid");
CREATE TABLE "new_manga_tag" (
    "pid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "manga_uuid" TEXT NOT NULL,
    "tag_uuid" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "manga_tag_manga_uuid_fkey" FOREIGN KEY ("manga_uuid") REFERENCES "manga" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_manga_tag" ("created_at", "manga_uuid", "pid", "tag_uuid", "updated_at") SELECT "created_at", "manga_uuid", "pid", "tag_uuid", "updated_at" FROM "manga_tag";
DROP TABLE "manga_tag";
ALTER TABLE "new_manga_tag" RENAME TO "manga_tag";
CREATE UNIQUE INDEX "manga_tag_manga_uuid_tag_uuid_key" ON "manga_tag"("manga_uuid", "tag_uuid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
