/*
  Warnings:

  - The primary key for the `Carro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Morador` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Porteiro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Registro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Visitante` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Registro" DROP CONSTRAINT "Registro_carroId_fkey";

-- DropForeignKey
ALTER TABLE "Registro" DROP CONSTRAINT "Registro_porteiroId_fkey";

-- DropForeignKey
ALTER TABLE "Registro" DROP CONSTRAINT "Registro_visitanteId_fkey";

-- DropForeignKey
ALTER TABLE "Visitante" DROP CONSTRAINT "Visitante_porteiroId_fkey";

-- DropForeignKey
ALTER TABLE "Visitante" DROP CONSTRAINT "Visitante_ultimaAtualizacaoPor_fkey";

-- AlterTable
ALTER TABLE "Carro" DROP CONSTRAINT "Carro_pkey",
ADD COLUMN     "moradorId" TEXT,
ADD COLUMN     "visitanteId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "donoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Carro_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Carro_id_seq";

-- AlterTable
ALTER TABLE "Morador" DROP CONSTRAINT "Morador_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Morador_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Morador_id_seq";

-- AlterTable
ALTER TABLE "Porteiro" DROP CONSTRAINT "Porteiro_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Porteiro_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Porteiro_id_seq";

-- AlterTable
ALTER TABLE "Registro" DROP CONSTRAINT "Registro_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "carroId" SET DATA TYPE TEXT,
ALTER COLUMN "visitanteId" SET DATA TYPE TEXT,
ALTER COLUMN "porteiroId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Registro_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Registro_id_seq";

-- AlterTable
ALTER TABLE "Visitante" DROP CONSTRAINT "Visitante_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "porteiroId" SET DATA TYPE TEXT,
ALTER COLUMN "ultimaAtualizacaoPor" SET DATA TYPE TEXT,
ADD CONSTRAINT "Visitante_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Visitante_id_seq";

-- AddForeignKey
ALTER TABLE "Visitante" ADD CONSTRAINT "Visitante_ultimaAtualizacaoPor_fkey" FOREIGN KEY ("ultimaAtualizacaoPor") REFERENCES "Porteiro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitante" ADD CONSTRAINT "Visitante_porteiroId_fkey" FOREIGN KEY ("porteiroId") REFERENCES "Porteiro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carro" ADD CONSTRAINT "Carro_moradorId_fkey" FOREIGN KEY ("moradorId") REFERENCES "Morador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carro" ADD CONSTRAINT "Carro_visitanteId_fkey" FOREIGN KEY ("visitanteId") REFERENCES "Visitante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_carroId_fkey" FOREIGN KEY ("carroId") REFERENCES "Carro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_visitanteId_fkey" FOREIGN KEY ("visitanteId") REFERENCES "Visitante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_porteiroId_fkey" FOREIGN KEY ("porteiroId") REFERENCES "Porteiro"("id") ON DELETE SET NULL ON UPDATE CASCADE;
