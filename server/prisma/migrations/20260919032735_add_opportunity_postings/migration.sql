-- CreateTable
CREATE TABLE "OpportunityPosting" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT,
    "contactEmail" TEXT,
    "description" TEXT NOT NULL,
    "riskScore" INTEGER,
    "badge" TEXT,
    "duplicateClusterSize" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpportunityPosting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpportunityPosting_userId_idx" ON "OpportunityPosting"("userId");

-- CreateIndex
CREATE INDEX "OpportunityPosting_createdAt_idx" ON "OpportunityPosting"("createdAt");

-- AddForeignKey
ALTER TABLE "OpportunityPosting" ADD CONSTRAINT "OpportunityPosting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
