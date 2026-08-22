/*
  Warnings:

  - Added the required column `visibleId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "visibleId" TEXT NOT NULL;
