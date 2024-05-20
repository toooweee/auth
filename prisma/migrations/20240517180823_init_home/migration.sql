/*
  Warnings:

  - You are about to drop the `tokens ` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tokens " DROP CONSTRAINT "tokens _userId_fkey";

-- DropTable
DROP TABLE "tokens ";

-- CreateTable
CREATE TABLE "tokens" (
    "token" TEXT NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
