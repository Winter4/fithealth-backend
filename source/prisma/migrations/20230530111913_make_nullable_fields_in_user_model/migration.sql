-- AlterTable
ALTER TABLE "User" ALTER COLUMN "sex" DROP NOT NULL,
ALTER COLUMN "weight" DROP NOT NULL,
ALTER COLUMN "height" DROP NOT NULL,
ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "activity" DROP NOT NULL,
ALTER COLUMN "target" DROP NOT NULL,
ALTER COLUMN "calories_limit" DROP NOT NULL;
