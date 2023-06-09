/*
  Warnings:

  - The primary key for the `Report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user_uuid,date]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Report" DROP CONSTRAINT "Report_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Report_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Report_user_uuid_date_key" ON "Report"("user_uuid", "date");
