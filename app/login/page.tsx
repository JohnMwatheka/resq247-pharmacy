/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const requestOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

type RequestOtpForm = z.infer<typeof requestOtpSchema>;
type VerifyOtpForm = z.infer<typeof verifyOtpSchema>;

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [emailForOtp, setEmailForOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const router = useRouter();

  // Form for requesting OTP
  const requestForm = useForm<RequestOtpForm>({
    resolver: zodResolver(requestOtpSchema),
    defaultValues: { email: '' },
  });

  // Form for verifying OTP
  const verifyForm = useForm<VerifyOtpForm>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email: '', otp: '' },
  });

  // Timer for Resend OTP
  React.useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const requestOtp = async (data: RequestOtpForm) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_otp',
          email: data.email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setEmailForOtp(data.email);
        verifyForm.setValue('email', data.email);
        setStep('otp');
        setResendTimer(60); // 60 seconds cooldown
        setMessage({ type: 'success', text: 'OTP sent successfully! Check your email.' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to send OTP' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (data: VerifyOtpForm) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_otp',
          email: data.email,
          otp: data.otp,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        
        // Save user info if needed (or use context / next-auth)
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message || 'Invalid OTP' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (resendTimer > 0) return;

    setMessage(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_otp',
          email: emailForOtp,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setResendTimer(60);
        setMessage({ type: 'success', text: 'New OTP sent successfully!' });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to resend OTP' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your ResQ247 Pharmacy account</p>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Email Input */}
            {step === 'email' && (
              <motion.div
                key="email-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <form onSubmit={requestForm.handleSubmit(requestOtp)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      {...requestForm.register('email')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 text-lg"
                      placeholder="john@example.com"
                      disabled={isSubmitting}
                    />
                    {requestForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {requestForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? 'Sending OTP...' : 'Send Verification Code'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 2: OTP Input */}
            {step === 'otp' && (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold">Enter Verification Code</h2>
                  <p className="text-gray-600 mt-1">
                    We sent a 6-digit code to <br />
                    <span className="font-medium text-gray-900">{emailForOtp}</span>
                  </p>
                </div>

                <form onSubmit={verifyForm.handleSubmit(verifyOtp)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Verification Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      {...verifyForm.register('otp')}
                      className="w-full px-6 py-5 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600 text-3xl tracking-[12px] text-center font-mono"
                      placeholder="123456"
                      disabled={isSubmitting}
                    />
                    {verifyForm.formState.errors.otp && (
                      <p className="text-red-500 text-sm mt-1 text-center">
                        {verifyForm.formState.errors.otp.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify & Sign In'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={resendOtp}
                      disabled={resendTimer > 0}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400"
                    >
                      {resendTimer > 0 
                        ? `Resend OTP in ${resendTimer}s` 
                        : 'Resend OTP'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Display */}
          {message && (
            <div className={`mt-6 p-4 rounded-2xl text-center text-sm font-medium border ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Back to Email Step */}
          {step === 'otp' && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setMessage(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Change Email
              </button>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Register as Pharmacist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}