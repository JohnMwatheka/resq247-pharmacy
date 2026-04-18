/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../lib/prisma';
import { sendOtpEmail } from '../../../../lib/mailgun';
import crypto from 'crypto';

const requestOtpSchema = z.object({ email: z.string().email() });
const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

async function hashOtp(otp: string) {
  return await bcrypt.hash(otp, 10);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, otp } = body;

    // ====================== SEND OTP ======================
    if (action === "send" || action === "request_otp") {
      const { email: validEmail } = requestOtpSchema.parse({ email });

      const normalizedEmail = validEmail.toLowerCase().trim();

      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true, status: true },
      });

      if (!user) return NextResponse.json({ success: false, message: "No account found with this email." }, { status: 404 });
      if (user.status !== "APPROVED") return NextResponse.json({ success: false, message: "Account not approved yet." }, { status: 403 });

      await prisma.otpCode.deleteMany({ where: { email: normalizedEmail, purpose: "LOGIN" } });

      const newOtp = generateOtp();
      const otpHash = await hashOtp(newOtp);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await prisma.otpCode.create({
        data: { email: normalizedEmail, otpHash, expiresAt, purpose: "LOGIN" },
      });

      await sendOtpEmail(validEmail, newOtp, "Login");

      return NextResponse.json({ success: true, message: "OTP sent successfully" });
    }

    // ====================== VERIFY OTP ======================
    if (action === "verify" || action === "verify_otp") {
      const { email: validEmail, otp: validOtp } = verifyOtpSchema.parse({ email, otp });

      const normalizedEmail = validEmail.toLowerCase().trim();

      const otpRecord = await prisma.otpCode.findFirst({
        where: {
          email: normalizedEmail,
          purpose: "LOGIN",
          expiresAt: { gt: new Date() },
        },
      });

      if (!otpRecord) {
        return NextResponse.json({ success: false, message: "OTP has expired or is invalid." }, { status: 400 });
      }

      const isValid = await bcrypt.compare(validOtp, otpRecord.otpHash);

      if (!isValid) {
        await prisma.otpCode.update({
          where: { id: otpRecord.id },
          data: { attempts: { increment: 1 } },
        });
        return NextResponse.json({ success: false, message: "Incorrect OTP" }, { status: 400 });
      }

      // Delete OTP after successful verification
      await prisma.otpCode.delete({ where: { id: otpRecord.id } });

      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true, email: true, fullName: true, role: true, phone: true },
      });

      return NextResponse.json({
        success: true,
        message: "Login successful",
        user,
      });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Login API Error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, message: error.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}