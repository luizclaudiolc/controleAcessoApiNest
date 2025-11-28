-- DropIndex
DROP INDEX "Registro_carroId_idx";

-- AlterTable
ALTER TABLE "Registro" ADD COLUMN     "placa" TEXT;

-- CreateIndex
CREATE INDEX "Registro_placa_idx" ON "Registro"("placa");
