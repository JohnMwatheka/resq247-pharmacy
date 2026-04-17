/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../lib/prisma';

const registerSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  email: z.string().email('Valid email is required'),
  fullName: z.string().min(3, 'Full name is required'),
  nationalId: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),

  ppbRegistrationNumber: z.string().min(5, 'PPB Registration Number is required'),
  ppbPracticingLicense: z.string().min(5, 'PPB Practicing License is required'),
  licenseExpiryDate: z.string().min(1, 'License expiry date is required'),
  qualification: z.string().min(3, 'Qualification is required'),
  yearsOfExperience: z.number().optional().default(0),

  password: z.string().min(6, 'Password must be at least 6 characters'),

  documents: z.array(z.object({
    type: z.string(),
    url: z.string(),
    name: z.string(),
  })).optional().default([]),

  consentGiven: z.boolean().refine(val => val === true, 'You must give consent'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Check for existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: data.phone },
          { email: data.email },
          { ppbRegistrationNumber: data.ppbRegistrationNumber },
          { ppbPracticingLicense: data.ppbPracticingLicense },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'USER_EXISTS',
        message: 'User with this phone, email, or PPB number already exists',
      }, { status: 409 });
    }

    // Create user with all fields
    const user = await prisma.user.create({
      data: {
        phone: data.phone,
        email: data.email,
        fullName: data.fullName,
        nationalId: data.nationalId,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender,
        address: data.address,

        ppbRegistrationNumber: data.ppbRegistrationNumber,
        ppbPracticingLicense: data.ppbPracticingLicense,
        licenseExpiryDate: new Date(data.licenseExpiryDate),
        qualification: data.qualification,
        yearsOfExperience: data.yearsOfExperience,

        password: hashedPassword,
        documents: data.documents,
        consentGiven: data.consentGiven,

        role: 'PHARMACIST',
        status: 'PENDING',                    // Using your new simplified status
        onboardingCompletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully. Awaiting admin verification.',
      userId: user.id,
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: error.errors[0]?.message || 'Invalid input',
      }, { status: 400 });
    }

    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to submit registration. Please try again.',
    }, { status: 500 });
  }
}