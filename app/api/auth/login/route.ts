/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../lib/prisma';
import { sendOtpEmail } from '../../../../lib/mailgun';
import crypto from 'crypto';

const requestOtpSchema = z.object({
  email: z.string().email('Valid email is required'),
});

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// Helper: Generate secure 6-digit OTP
function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Helper: Hash OTP (never store plain text)
async function hashOtp(otp: string): Promise<string> {
  return await bcrypt.hash(otp, 10);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // === STEP 1: Request OTP ===
    if (action === 'request_otp') {
      const { email } = requestOtpSchema.parse(body);

      // Check if user exists and is approved
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        select: { id: true, status: true, fullName: true },
      });

      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'No account found with this email.',
        }, { status: 404 });
      }

      if (user.status !== 'APPROVED') {
        return NextResponse.json({
          success: false,
          error: 'ACCOUNT_NOT_APPROVED',
          message: 'Your account is still under review or has been rejected.',
        }, { status: 403 });
      }

      // Delete any existing OTP for this email + LOGIN purpose
      await prisma.otpCode.deleteMany({
        where: { email: email.toLowerCase(), purpose: 'LOGIN' },
      });

      const otp = generateOtp();
      const otpHash = await hashOtp(otp);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      await prisma.otpCode.create({
        data: {
          email: email.toLowerCase(),
          otpHash,
          expiresAt,
          purpose: 'LOGIN',
        },
      });

      // Send OTP via Mailgun
      await sendOtpEmail(email, otp, 'Login');

      return NextResponse.json({
        success: true,
        message: 'OTP sent to your email. Please check your inbox (and spam folder).',
      });
    }

    // === STEP 2: Verify OTP & Login ===
    if (action === 'verify_otp') {
      const { email, otp } = verifyOtpSchema.parse(body);

      const otpRecord = await prisma.otpCode.findFirst({
        where: {
          email: email.toLowerCase(),
          purpose: 'LOGIN',
          expiresAt: { gt: new Date() },
        },
      });

      if (!otpRecord) {
        return NextResponse.json({
          success: false,
          error: 'OTP_EXPIRED',
          message: 'OTP has expired or is invalid. Please request a new one.',
        }, { status: 400 });
      }

      // Check attempts (anti-brute force)
      if (otpRecord.attempts >= 5) {
        await prisma.otpCode.delete({ where: { id: otpRecord.id } });
        return NextResponse.json({
          success: false,
          error: 'TOO_MANY_ATTEMPTS',
          message: 'Too many failed attempts. Please request a new OTP.',
        }, { status: 429 });
      }

      const isValidOtp = await bcrypt.compare(otp, otpRecord.otpHash);

      if (!isValidOtp) {
        // Increment failed attempts
        await prisma.otpCode.update({
          where: { id: otpRecord.id },
          data: { attempts: { increment: 1 } },
        });

        return NextResponse.json({
          success: false,
          error: 'INVALID_OTP',
          message: 'Incorrect OTP. Please try again.',
        }, { status: 400 });
      }

      // OTP is valid → Delete it (single use)
      await prisma.otpCode.delete({ where: { id: otpRecord.id } });

      // Get full user for session/JWT
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          status: true,
          phone: true,
        },
      });

      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }

      // TODO: Create session or JWT token here
      // For now, return user data (you can integrate next-auth, lucia, or custom JWT)

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          phone: user.phone,
        },
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: error.errors[0]?.message,
      }, { status: 400 });
    }

    console.error('Login OTP error:', error);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Something went wrong. Please try again.',
    }, { status: 500 });
  }
}