/*
  Warnings:

  - You are about to drop the column `sentTime` on the `Message` table. All the data in the column will be lost.
  - Added the required column `password` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PUBLIC', 'PROTECTED', 'PRIVATE');

-- DropIndex
DROP INDEX "Channel_ownerId_key";

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "type" "ChannelType" NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "sentTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_Admin" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Member" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Admin_AB_unique" ON "_Admin"("A", "B");

-- CreateIndex
CREATE INDEX "_Admin_B_index" ON "_Admin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Member_AB_unique" ON "_Member"("A", "B");

-- CreateIndex
CREATE INDEX "_Member_B_index" ON "_Member"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Admin" ADD CONSTRAINT "_Admin_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Admin" ADD CONSTRAINT "_Admin_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Member" ADD CONSTRAINT "_Member_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Member" ADD CONSTRAINT "_Member_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
