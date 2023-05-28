/*
  Warnings:

  - The primary key for the `State` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `State` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tg_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_tg_id` to the `State` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "State" DROP CONSTRAINT "State_user_id_fkey";

-- AlterTable
ALTER TABLE "State" DROP CONSTRAINT "State_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "user_tg_id" TEXT NOT NULL,
ADD CONSTRAINT "State_pkey" PRIMARY KEY ("user_tg_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_tg_id_key" ON "User"("tg_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- AddForeignKey
ALTER TABLE "State" ADD CONSTRAINT "State_user_tg_id_fkey" FOREIGN KEY ("user_tg_id") REFERENCES "User"("tg_id") ON DELETE RESTRICT ON UPDATE CASCADE;
