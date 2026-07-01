"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { showToast } from "@/store/features/toast/toastSlice";
import { useAppDispatch } from "@/store/hooks";

interface VerifyOTPProps {
  phoneNumber: string;
  onBack: () => void;
  onVerify: (code: string) => void;
}

export default function VerifyOTP({ phoneNumber, onBack, onVerify }: VerifyOTPProps) {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      setError("");
      onVerify(code);
    } else {
      setError("Please enter a 6-digit OTP code.");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone: phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.result) {
        setTimer(60);
        setCanResend(false);
        dispatch(showToast({ message: "OTP has been resent successfully!", type: "success" }));
      } else {
        dispatch(showToast({ message: data.message || "Failed to resend OTP", type: "error" }));
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      dispatch(showToast({ message: "Something went wrong while resending OTP", type: "error" }));
    }
  };

  return (
    <div className="w-full">
      {/* Headings */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Code Verification</h1>
        <p className="text-[13px] font-medium text-gray-600">
          (One Time Password)
        </p>
      </div>

      {/* Message */}
      <div className="text-center mb-8 px-4">
        <p className="text-xl leading-relaxed text-gray-700 font-medium">
          {phoneNumber.includes("@")
            ? "OTP 6 digit code has been sent to your email check the email inbox"
            : "OTP 6 digit code has been sent to your phone check the Phone inbox"}
        </p>
      </div>

      {/* Sub-info / Change Number */}
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-[13px] text-gray-500 font-medium">
          {phoneNumber} Is Not Correct?
        </p>
        <button
          onClick={onBack}
          className="text-[13px] font-bold text-[#0081FF] hover:underline"
        >
          {phoneNumber.includes("@") ? "Change Email" : "Change Number"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input */}
        <div className="border border-black rounded-md h-[50px] px-4 transition-all duration-300 bg-gray-50 flex items-center">
          <input
            type="text"
            placeholder="854**"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-300 text-[16px] font-medium"
            maxLength={6}
          />
        </div>
        {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}

        {/* Resend Support */}
        <div className="flex items-center justify-between px-1">
          <p className="text-[13px] text-gray-500 font-medium">
            Didn&apos;t Received OTP
          </p>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-[13px] font-bold text-[#0081FF] hover:text-blue-700"
            >
              Resend Code
            </button>
          ) : (
            <p className="text-[13px] font-bold text-gray-400">
              Resend in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
            </p>
          )}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full bg-[#0081FF] hover:bg-blue-600 text-white font-semibold text-[14px] h-[42px] rounded-full transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-[0.98] mt-4"
        >
          Verify Code
        </button>
      </form>

      {/* Footer Links (Agreement) */}
      <div className="mt-8 text-center">
        <p className="text-[10px] leading-relaxed text-gray-500 px-4">
          By Tapping Send OTP, You Agree To{" "}
          <Link href="/terms" className="hover:underline">Terms And Conditions</Link>{" "}
          And <Link href="/policy/privacy" className="hover:underline">Privacy Policy</Link> Of Electra International
        </p>
      </div>
    </div>
  );
}
