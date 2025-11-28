/*
  Warnings:

  - You are about to drop the column `placa` on the `Registro` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Registro_placa_idx";

-- AlterTable
ALTER TABLE "Registro" DROP COLUMN "placa";

-- CreateIndex
CREATE INDEX "Registro_carroId_idx" ON "Registro"("carroId");
