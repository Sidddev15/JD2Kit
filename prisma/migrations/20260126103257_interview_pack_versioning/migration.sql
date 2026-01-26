/*
  Warnings:

  - A unique constraint covering the columns `[jobRunId,version]` on the table `InterviewPack` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `version` to the `InterviewPack` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."InterviewPack_jobRunId_key";

-- AlterTable
ALTER TABLE "InterviewPack" ADD COLUMN     "isLatest" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "version" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "InterviewPack_jobRunId_idx" ON "InterviewPack"("jobRunId");

-- CreateIndex
CREATE INDEX "InterviewPack_isLatest_idx" ON "InterviewPack"("isLatest");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewPack_jobRunId_version_key" ON "InterviewPack"("jobRunId", "version");
