/*
  Warnings:

  - The primary key for the `Morador` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Morador" DROP CONSTRAINT "Morador_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Morador_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Morador_id_seq";
