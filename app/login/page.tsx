/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { ArrowLeft } from "lucide-react";

type FormData = { otp: string };

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const router = useRouter();
  const otpInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>();

  // Auto focus OTP input
  useEffect(() => {
    if (otpSent && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [otpSent]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // SweetAlert Toaster
  const showToast = (title: string, icon: 'success' | 'error' | 'warning') => {
    Swal.fire({
      title,
      icon,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      customClass: {
        popup: 'swal-toast',
      },
    });
  };

  const callLoginApi = async (payload: any) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Request failed");
      }

      if (payload.action === "send") {
        setOtpSent(true);
        setResendCooldown(60);
        showToast("OTP sent successfully! Please check your email.", "success");
        return;
      }

      // Successful OTP Verification
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      showToast("Login successful! redirecting...", "success");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      showToast(err.message || "Something went wrong. Please try again.", "error");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!email.trim()) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    await callLoginApi({ 
      email: email.trim().toLowerCase(), 
      action: "send" 
    });
  };

  const verifyOTP = async (data: FormData) => {
    await callLoginApi({
      email: email.trim().toLowerCase(),
      otp: data.otp.trim(),
      action: "verify",
    });
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await sendOTP();
  };

  const handleBack = () => {
    setOtpSent(false);
    reset();
    setValue("otp", "");
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-linear-to-tl from-white/55 to-white">
      <div className="w-full max-w-5xl">

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden min-h-120">
          <div className="flex flex-col items-center justify-center p-10 bg-linear-to-r from-blue-200 to-white">
            <Image 
              src="/logo.png" 
              alt="ResQ247 Logo" 
              width={140} 
              height={140} 
              className="object-contain" 
              priority 
            />
            <h1 className="text-3xl font-bold text-blue-950 mt-6">Welcome Back</h1>
            <p className="text-base text-gray-600 text-center mt-1">Sign in with OTP</p>
          </div>

          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-sm">
              <LoginFormContent
                email={email}
                setEmail={setEmail}
                otpSent={otpSent}
                isLoading={isLoading}
                resendCooldown={resendCooldown}
                sendOTP={sendOTP}
                verifyOTP={verifyOTP}
                handleBack={handleBack}
                handleResend={handleResend}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                otpInputRef={otpInputRef}
                setValue={setValue}
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <Image 
                src="/logo.png" 
                alt="ResQ247 Logo" 
                width={110} 
                height={110} 
                className="object-contain" 
                priority 
              />
            </div>
            <h1 className="text-2xl font-bold text-center text-blue-950 mb-1">Welcome Back</h1>
            <p className="text-center text-gray-600 mb-8 text-sm">Sign in with OTP</p>

            <div className="max-w-sm mx-auto">
              <LoginFormContent
                email={email}
                setEmail={setEmail}
                otpSent={otpSent}
                isLoading={isLoading}
                resendCooldown={resendCooldown}
                sendOTP={sendOTP}
                verifyOTP={verifyOTP}
                handleBack={handleBack}
                handleResend={handleResend}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                otpInputRef={otpInputRef}
                setValue={setValue}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ====================== FORM CONTENT COMPONENT ======================
interface LoginFormContentProps {
  email: string;
  setEmail: (email: string) => void;
  otpSent: boolean;
  isLoading: boolean;
  resendCooldown: number;
  sendOTP: () => Promise<void>;
  verifyOTP: (data: FormData) => Promise<void>;
  handleBack: () => void;
  handleResend: () => Promise<void>;
  register: any;
  handleSubmit: any;
  errors: any;
  otpInputRef: React.RefObject<HTMLInputElement | null>;
  setValue: (name: "otp", value: string) => void;
}

function LoginFormContent({
  email,
  setEmail,
  otpSent,
  isLoading,
  resendCooldown,
  sendOTP,
  verifyOTP,
  handleBack,
  handleResend,
  register,
  handleSubmit,
  errors,
  otpInputRef,
  setValue,
}: LoginFormContentProps) {
  return (
    <div className="space-y-5 text-sm">
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-700">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
          placeholder="someone@example.com"
          disabled={isLoading || otpSent}
        />
      </div>

      {!otpSent ? (
        <button
          onClick={sendOTP}
          disabled={isLoading || !email.trim()}
          className="w-full py-3.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-xl disabled:opacity-70 transition"
        >
          {isLoading ? "Sending OTP..." : "Send Verification Code"}
        </button>
      ) : (
        <form onSubmit={handleSubmit(verifyOTP)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">
              Enter 6-digit code sent to <span className="font-semibold">{email}</span>
            </label>
            <input
              ref={otpInputRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 text-2xl tracking-[8px] text-center font-mono"
              placeholder="123456"
              {...register("otp", {
                requiblue: "OTP is requiblue",
                pattern: { value: /^\d{6}$/, message: "OTP must be exactly 6 digits" },
              })}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                e.target.value = value;
                setValue("otp", value);
              }}
            />
            {errors.otp && <p className="text-blue-600 text-xs text-center">{errors.otp.message}</p>}
          </div>

          <div className="flex gap-18">
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm hover:shadow transition-all duration-200 disabled:opacity-70"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm hover:shadow transition-all duration-200 disabled:opacity-70"
            >
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isLoading}
              className="text-blue-950 hover:underline text-xs disabled:text-gray-400"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}