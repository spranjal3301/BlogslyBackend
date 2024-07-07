/*
  Warnings:

  - The `status` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Inactive');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Active';
