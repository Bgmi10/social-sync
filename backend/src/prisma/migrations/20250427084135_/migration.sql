/*
  Warnings:

  - A unique constraint covering the columns `[userId,mediaName]` on the table `Connection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Connection_userId_mediaName_key" ON "Connection"("userId", "mediaName");
