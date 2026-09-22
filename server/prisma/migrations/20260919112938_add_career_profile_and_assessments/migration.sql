/*
  Warnings:

  - You are about to drop the column `readiness` on the `CareerProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CareerProfile" DROP COLUMN "readiness",
ADD COLUMN     "branch" TEXT,
ADD COLUMN     "college" TEXT,
ADD COLUMN     "domain" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "leetcodeUrl" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "year" TEXT,
ALTER COLUMN "targetRole" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "SkillAssessment_careerProfileId_idx" ON "SkillAssessment"("careerProfileId");
