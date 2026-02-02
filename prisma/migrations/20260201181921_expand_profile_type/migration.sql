/*
  Warnings:

  - The values [FRONTEND,BACKEND,FULLSTACK] on the enum `ProfileType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProfileType_new" AS ENUM ('FRONTEND_ENGINEER', 'BACKEND_ENGINEER', 'FULLSTACK_ENGINEER', 'MOBILE_ENGINEER', 'DEVOPS_ENGINEER', 'DATA_ENGINEER', 'ML_ENGINEER', 'QA_ENGINEER', 'PRODUCT_MANAGER', 'PRODUCT_DESIGNER', 'BUSINESS_ANALYST', 'HR', 'RECRUITER', 'OPERATIONS', 'PROJECT_MANAGER', 'PROGRAM_MANAGER', 'SALES', 'CUSTOMER_SUCCESS', 'TECH_LEAD', 'ENGINEERING_MANAGER', 'INTERN');

-- Move existing enum values directly during the type switch to avoid invalid updates
ALTER TABLE "JobRun" ALTER COLUMN "profileType" TYPE "ProfileType_new" USING (
  CASE "profileType"
    WHEN 'FRONTEND'::"ProfileType" THEN 'FRONTEND_ENGINEER'::"ProfileType_new"
    WHEN 'BACKEND'::"ProfileType" THEN 'BACKEND_ENGINEER'::"ProfileType_new"
    WHEN 'FULLSTACK'::"ProfileType" THEN 'FULLSTACK_ENGINEER'::"ProfileType_new"
    ELSE 'FULLSTACK_ENGINEER'::"ProfileType_new"
  END
);

-- Drop the old enum and rename the new one into place
ALTER TYPE "ProfileType" RENAME TO "ProfileType_old";
ALTER TYPE "ProfileType_new" RENAME TO "ProfileType";
DROP TYPE "public"."ProfileType_old";
COMMIT;
