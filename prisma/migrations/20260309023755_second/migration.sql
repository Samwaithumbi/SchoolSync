/*
  Warnings:

  - Changed the type of `status` on the `Assignment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'in_progress', 'submitted');

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;
