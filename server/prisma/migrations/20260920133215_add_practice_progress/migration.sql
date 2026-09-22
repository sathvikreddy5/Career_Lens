-- CreateTable
CREATE TABLE "PracticeProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "taskIndex" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PracticeProgress_userId_idx" ON "PracticeProgress"("userId");

-- CreateIndex
CREATE INDEX "PracticeProgress_skillId_idx" ON "PracticeProgress"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeProgress_userId_skillId_taskIndex_key" ON "PracticeProgress"("userId", "skillId", "taskIndex");

-- AddForeignKey
ALTER TABLE "PracticeProgress" ADD CONSTRAINT "PracticeProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
