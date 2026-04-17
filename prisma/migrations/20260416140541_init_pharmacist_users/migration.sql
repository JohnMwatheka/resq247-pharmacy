-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PHARMACIST', 'PHARMACY_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'PENDING_VERIFICATION', 'MANUAL_REVIEW', 'APPROVED', 'REJECTED', 'ACTIVE', 'SUSPENDED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nationalId" TEXT,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "address" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PHARMACIST',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "ppbRegistrationNumber" TEXT,
    "ppbPracticingLicense" TEXT,
    "licenseExpiryDate" TIMESTAMP(3),
    "qualification" TEXT,
    "yearsOfExperience" INTEGER,
    "documents" JSONB,
    "posPinHash" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "onboardingCompletedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_nationalId_key" ON "users"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "users_ppbRegistrationNumber_key" ON "users"("ppbRegistrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_ppbPracticingLicense_key" ON "users"("ppbPracticingLicense");
