/*
  Warnings:

  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
ADD COLUMN     "channelId" TEXT,
ADD COLUMN     "chatId" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChatToUser_AB_unique" ON "_ChatToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatToUser_B_index" ON "_ChatToUser"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToUser" ADD CONSTRAINT "_ChatToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToUser" ADD CONSTRAINT "_ChatToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
