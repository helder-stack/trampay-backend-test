/*
  Warnings:

  - Added the required column `expiresAt` to the `PasswordTokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PasswordTokens" ADD COLUMN     "expiresAt" DATE NOT NULL;
