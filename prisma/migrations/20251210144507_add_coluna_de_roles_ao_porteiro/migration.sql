-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'PORTEIRO');

-- AlterTable
ALTER TABLE "Porteiro" ADD COLUMN     "roles" "Roles"[];
