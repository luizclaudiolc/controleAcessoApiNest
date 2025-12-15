/*
  Warnings:

  - You are about to drop the column `ultimaAtualizacaoPor` on the `Visitante` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Visitante" DROP CONSTRAINT "Visitante_ultimaAtualizacaoPor_fkey";

-- AlterTable
ALTER TABLE "Morador" ADD COLUMN     "atualizadoPorId" TEXT,
ADD COLUMN     "criadoPorId" TEXT;

-- AlterTable
ALTER TABLE "Visitante" DROP COLUMN "ultimaAtualizacaoPor",
ADD COLUMN     "atualizadoPorId" TEXT,
ADD COLUMN     "criadoPorId" TEXT;

-- AddForeignKey
ALTER TABLE "Morador" ADD CONSTRAINT "Morador_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Porteiro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Morador" ADD CONSTRAINT "Morador_atualizadoPorId_fkey" FOREIGN KEY ("atualizadoPorId") REFERENCES "Porteiro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitante" ADD CONSTRAINT "Visitante_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Porteiro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitante" ADD CONSTRAINT "Visitante_atualizadoPorId_fkey" FOREIGN KEY ("atualizadoPorId") REFERENCES "Porteiro"("id") ON DELETE SET NULL ON UPDATE CASCADE;
