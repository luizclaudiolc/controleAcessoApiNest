/*
  Warnings:

  - Made the column `donoId` on table `Carro` required. This step will fail if there are existing NULL values in that column.
  - Made the column `donoTipo` on table `Carro` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Registro_visitanteId_idx";

-- AlterTable
ALTER TABLE "Carro" ALTER COLUMN "donoId" SET NOT NULL,
ALTER COLUMN "donoTipo" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Registro_visitanteId_dataHoraSaida_idx" ON "Registro"("visitanteId", "dataHoraSaida");
