/*
  Warnings:

  - You are about to alter the column `source_type` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `priority` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "source_type" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "priority" SET DATA TYPE VARCHAR(50);
