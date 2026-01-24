-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'FINAL');

-- CreateEnum
CREATE TYPE "ProfileType" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobRun" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "profileType" "ProfileType" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "companyName" TEXT,
    "roleTitle" TEXT NOT NULL,
    "location" TEXT,
    "seniorityLevel" TEXT,
    "domain" TEXT,
    "jdText" TEXT NOT NULL,
    "jobJson" JSONB NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptOutput" (
    "id" TEXT NOT NULL,
    "jobRunId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptOutput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewPack" (
    "id" TEXT NOT NULL,
    "jobRunId" TEXT NOT NULL,
    "topics" JSONB NOT NULL,
    "questions" JSONB NOT NULL,
    "answerGuides" JSONB NOT NULL,
    "followUps" JSONB NOT NULL,
    "codingTasks" JSONB NOT NULL,
    "systemDesign" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewPack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "JobRun_profileType_idx" ON "JobRun"("profileType");

-- CreateIndex
CREATE INDEX "JobRun_companyName_idx" ON "JobRun"("companyName");

-- CreateIndex
CREATE INDEX "JobRun_roleTitle_idx" ON "JobRun"("roleTitle");

-- CreateIndex
CREATE INDEX "JobRun_createdAt_idx" ON "JobRun"("createdAt");

-- CreateIndex
CREATE INDEX "PromptOutput_type_idx" ON "PromptOutput"("type");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewPack_jobRunId_key" ON "InterviewPack"("jobRunId");

-- AddForeignKey
ALTER TABLE "JobRun" ADD CONSTRAINT "JobRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptOutput" ADD CONSTRAINT "PromptOutput_jobRunId_fkey" FOREIGN KEY ("jobRunId") REFERENCES "JobRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewPack" ADD CONSTRAINT "InterviewPack_jobRunId_fkey" FOREIGN KEY ("jobRunId") REFERENCES "JobRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
