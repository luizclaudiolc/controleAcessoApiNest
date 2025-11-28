/*
  Warnings:

  - You are about to drop the column `moradorId` on the `Carro` table. All the data in the column will be lost.
  - You are about to drop the column `visitanteId` on the `Carro` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DonoTipo" AS ENUM ('MORADOR', 'VISITANTE');

-- DropForeignKey
ALTER TABLE "Carro" DROP CONSTRAINT "Carro_moradorId_fkey";

-- DropForeignKey
ALTER TABLE "Carro" DROP CONSTRAINT "Carro_visitanteId_fkey";

-- AlterTable
ALTER TABLE "Carro" DROP COLUMN "moradorId",
DROP COLUMN "visitanteId",
ADD COLUMN     "donoId" INTEGER,
ADD COLUMN     "donoTipo" "DonoTipo";

-- CreateIndex
CREATE INDEX "Carro_donoTipo_donoId_idx" ON "Carro"("donoTipo", "donoId");
