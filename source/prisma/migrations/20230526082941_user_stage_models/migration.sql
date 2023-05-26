-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "Activity" AS ENUM ('ZERO', 'LOW', 'MIDDLE', 'HIGH');

-- CreateEnum
CREATE TYPE "Target" AS ENUM ('LOSE', 'KEEP', 'GAIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "tg_id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "sex" "Gender" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "activity" "Activity" NOT NULL,
    "target" "Target" NOT NULL,
    "calories_limit" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "State" (
    "user_id" INTEGER NOT NULL,
    "scene" TEXT NOT NULL,
    "registered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "State_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "State" ADD CONSTRAINT "State_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
