-- AlterTable
ALTER TABLE "Visitante" ADD COLUMN     "porteiroId" INTEGER,
ADD COLUMN     "ultimaAtualizacaoPor" INTEGER;

-- AddForeignKey
ALTER TABLE "Visitante" ADD CONSTRAINT "Visitante_ultimaAtualizacaoPor_fkey" FOREIGN KEY ("ultimaAtualizacaoPor") REFERENCES "Porteiro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitante" ADD CONSTRAINT "Visitante_porteiroId_fkey" FOREIGN KEY ("porteiroId") REFERENCES "Porteiro"("id") ON DELETE SET NULL ON UPDATE CASCADE;
