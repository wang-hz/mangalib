-- CreateTable
CREATE TABLE "manga" (
    "pid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "manga_uuid_key" ON "manga"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "manga_path_key" ON "manga"("path");
