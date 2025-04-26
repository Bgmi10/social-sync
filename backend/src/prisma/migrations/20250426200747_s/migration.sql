/*
  Warnings:

  - Added the required column `expiresIn` to the `Connection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Connection" ADD COLUMN     "expiresIn" INTEGER NOT NULL;
