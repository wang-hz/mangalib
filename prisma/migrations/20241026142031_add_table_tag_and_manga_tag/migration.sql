-- CreateTable
CREATE TABLE "tag" (
    "pid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "manga_tag" (
    "pid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "manga_uuid" TEXT NOT NULL,
    "tag_uuid" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_uuid_key" ON "tag"("uuid");

-- CreateIndex
CREATE INDEX "tag_name_type_idx" ON "tag"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "manga_tag_manga_uuid_tag_uuid_key" ON "manga_tag"("manga_uuid", "tag_uuid");
