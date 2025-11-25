/*
  Warnings:

  - You are about to drop the `CarroVisitante` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoRegistro" AS ENUM ('ENTRADA', 'SAIDA');

-- DropForeignKey
ALTER TABLE "Carro" DROP CONSTRAINT "Carro_moradorId_fkey";

-- DropForeignKey
ALTER TABLE "CarroVisitante" DROP CONSTRAINT "CarroVisitante_visitanteId_fkey";

-- AlterTable
ALTER TABLE "Carro" ALTER COLUMN "moradorId" DROP NOT NULL;

-- DropTable
DROP TABLE "CarroVisitante";

-- CreateTable
CREATE TABLE "Registro" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoRegistro" NOT NULL,
    "carroId" INTEGER,
    "placa" TEXT,
    "visitanteId" INTEGER,
    "dataHoraEntrada" TIMESTAMP(3) NOT NULL,
    "dataHoraSaida" TIMESTAMP(3),
    "porteiroId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Registro_placa_idx" ON "Registro"("placa");

-- CreateIndex
CREATE INDEX "Registro_tipo_idx" ON "Registro"("tipo");

-- CreateIndex
CREATE INDEX "Registro_porteiroId_idx" ON "Registro"("porteiroId");

-- CreateIndex
CREATE INDEX "Registro_dataHoraEntrada_idx" ON "Registro"("dataHoraEntrada");

-- CreateIndex
CREATE INDEX "Registro_visitanteId_idx" ON "Registro"("visitanteId");

-- AddForeignKey
ALTER TABLE "Carro" ADD CONSTRAINT "Carro_moradorId_fkey" FOREIGN KEY ("moradorId") REFERENCES "Morador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_carroId_fkey" FOREIGN KEY ("carroId") REFERENCES "Carro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_visitanteId_fkey" FOREIGN KEY ("visitanteId") REFERENCES "Visitante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_porteiroId_fkey" FOREIGN KEY ("porteiroId") REFERENCES "Porteiro"("id") ON DELETE SET NULL ON UPDATE CASCADE;
