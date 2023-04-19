-- CreateTable
CREATE TABLE "PasswordTokens" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "PasswordTokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PasswordTokens" ADD CONSTRAINT "PasswordTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
