/*
  Warnings:

  - The primary key for the `Report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP CONSTRAINT "Report_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Report_pkey" PRIMARY KEY ("user_uuid", "date");
