-- CreateTable
CREATE TABLE "FavoriteList" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FavoriteList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteItem" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "posterPath" TEXT,
    "overview" TEXT,
    "voteAverage" DOUBLE PRECISION NOT NULL,
    "releaseDate" TEXT,

    CONSTRAINT "FavoriteItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteItem_listId_movieId_key" ON "FavoriteItem"("listId", "movieId");

-- AddForeignKey
ALTER TABLE "FavoriteItem" ADD CONSTRAINT "FavoriteItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "FavoriteList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
