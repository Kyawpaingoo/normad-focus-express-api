/*
  Warnings:

  - You are about to drop the column `titile` on the `Expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "titile",
ADD COLUMN     "title" VARCHAR(50);
