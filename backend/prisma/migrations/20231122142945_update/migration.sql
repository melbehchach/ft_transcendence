/*
  Warnings:

  - Changed the type of `type` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GameTypo" AS ENUM ('RandomMatch', 'FriendMatch');

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "type",
ADD COLUMN     "type" "GameTypo" NOT NULL;

-- DropEnum
DROP TYPE "GameType";
