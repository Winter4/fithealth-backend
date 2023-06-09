-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "calories_limit" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
