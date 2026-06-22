"use client";

import { useState } from "react";
import Image from "next/image";
import { FaPhoneAlt, FaEnvelope, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import VerifyOTP from "./VerifyOTP";

import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/features/auth/authSlice";
import { useRouter, useSearchParams } from "next/navigation";

type LoginStep = "login" | "verify";

type LoginType = "phone" | "mail";

interface Country {
  name: string;
  code: string;
  prefix: string;
  flag: string;
  length: number;
}

const COUNTRIES: Country[] = [
  { name: "Bangladesh", code: "BD", prefix: "+880", flag: "https://flagcdn.com/w40/bd.png", length: 11 },
  { name: "USA", code: "US", prefix: "+1", flag: "https://flagcdn.com/w40/us.png", length: 10 },
  { name: "India", code: "IN", prefix: "+91", flag: "https://flagcdn.com/w40/in.png", length: 10 },
  { name: "UK", code: "GB", prefix: "+44", flag: "https://flagcdn.com/w40/gb.png", length: 10 },
];

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [loginType, setLoginType] = useState<LoginType>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [step, setStep] = useState<LoginStep>("login");
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  // Toggle handlers
  const handleToggle = (type: LoginType) => {
    setLoginType(type);
    setError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = loginType === "phone" ? fullPhoneNumber : email;

    if (loginType === "phone") {
      const cleanNumber = phoneNumber.replace(/\s/g, "");
      if (cleanNumber.length !== selectedCountry.length) {
        setError(true);
        return;
      }
    } else {
      if (!email || !email.includes("@")) {
        setError(true);
        return;
      }
    }

    setError(false);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone: identifier,
        }),
      });

      const data = await response.json();

      if (data.result) {
        setStep("verify");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      alert("Something went wrong while sending OTP");
    }
  };

  const handlePhoneNumberChange = (val: string) => {
    const numericValue = val.replace(/\D/g, "");
    const limitedValue = numericValue.slice(0, selectedCountry.length);
    setPhoneNumber(limitedValue);
    if (error) setError(false);
  };

  const handleVerify = async (code: string) => {
    try {
      const response = await fetch("/api/auth/otp-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone: loginType === "mail" ? email : fullPhoneNumber,
          otp: code,
        }),
      });

      const data = await response.json();

      if (data.result) {
        dispatch(
          setCredentials({
            user: data.user,
            token: data.token,
          })
        );
        router.push(redirect);
      } else {
        alert(data.message || "Invalid OTP or login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong during login");
    }
  };

  const cleanPhoneNumber = selectedCountry.code === "BD" && phoneNumber.startsWith("0") ? phoneNumber.substring(1) : phoneNumber;
  const fullPhoneNumber = `${selectedCountry.prefix}${cleanPhoneNumber}`;

  return (
    <div className="w-full max-w-[420px] mx-auto bg-white p-8 md:p-10 mt-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[500px] flex flex-col justify-center">
      {step === "login" ? (
        <>
          {/* Logo */}
          <div className="flex justify-center mb-1">
            <Image
              src="/images/logoelectra.png"
              alt="Electra International"
              width={220}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          {/* Greetings */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Welcome To Electra</h1>
            <p className="text-[13px] text-gray-500 font-medium">
              Unlock Exclusive Offers & A Personalized Experience
            </p>
          </div>

          {/* Login Type Switcher */}
          <div className="flex items-center justify-center mb-5">
            <div className="inline-flex items-center p-1  rounded-2xl ">
              <button
                onClick={() => handleToggle("phone")}
                className={`flex items-center gap-2.5 px-8 py-2  text-[14px] font-semibold transition-all duration-300 ${loginType === "phone"
                  ? "bg-[#0054A6] text-white shadow-lg shadow-blue-900/20"
                  : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                <FaPhoneAlt size={14} />
                Phone
              </button>
              <div className="w-[2px] h-6 bg-gray-900 mx-2"></div>
              <button
                onClick={() => handleToggle("mail")}
                className={`flex items-center gap-2.5 px-8 py-3  text-sm font-semibold transition-all duration-300 ${loginType === "mail"
                  ? "bg-[#0054A6] text-white shadow-lg shadow-blue-900/20"
                  : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                <FaEnvelope size={14} />
                Mail
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {loginType === "phone" ? (
              <div className="space-y-4">
                <label className="block text-[13px] font-semibold text-gray-600 ml-1">
                  Phone Number<span className="text-red-500 ml-0.5">*</span>
                </label>

                {/* Country Selector + Input */}
                <div className="relative">
                  <div className={`flex items-center border rounded-md h-[50px] border-black px-4 transition-all duration-300 bg-gray-50 ${error ? "border-red-500" : "border-gray-200"}`}>
                    <div
                      className="flex items-center gap-2 pr-4 border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors h-full"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    >
                      <div className="w-6 h-4 overflow-hidden rounded-sm shadow-sm flex-shrink-0">
                        <Image
                          src={selectedCountry.flag}
                          alt={selectedCountry.code}
                          width={24}
                          height={16}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700 min-w-[40px]">{selectedCountry.prefix}</span>
                      <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      placeholder={selectedCountry.name === "Bangladesh" ? "019***********" : "Enter number"}
                      value={phoneNumber}
                      onChange={(e) => handlePhoneNumberChange(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-300 text-[15px] pl-4 font-medium"
                    />
                  </div>

                  {/* Country Dropdown Menu */}
                  {isCountryDropdownOpen && (
                    <div className="absolute top-[55px] left-0 z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-[200px] overflow-y-auto">
                      {COUNTRIES.map((country) => (
                        <div
                          key={country.code}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedCountry(country);
                            setIsCountryDropdownOpen(false);
                            setPhoneNumber(""); // Reset on country change
                          }}
                        >
                          <div className="w-6 h-4 overflow-hidden rounded-sm shadow-sm flex-shrink-0">
                            <Image
                              src={country.flag}
                              alt={country.code}
                              width={24}
                              height={16}
                              className="object-cover"
                            />
                          </div>
                          <span className="text-[14px] font-medium text-gray-700 flex-1">{country.name}</span>
                          <span className="text-[13px] text-gray-400 font-semibold">{country.prefix}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="animate-slide-up">
                    <div className="flex items-center justify-between border-2 border-red-500 rounded-md h-[50px] px-4 bg-red-50/10">
                      <input
                        type="tel"
                        value={phoneNumber}
                        readOnly
                        className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-red-600 font-bold text-[15px]"
                      />
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white shadow-sm shadow-red-200">
                        <span className="text-[14px] font-bold">!</span>
                      </div>
                    </div>
                    <p className="text-[11px] font-medium text-red-500 mt-2 ml-1">Invalid phone number! Please Try Again.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-[13px] font-semibold text-gray-600 ml-1">
                  Email Address<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className={`border rounded-md h-[50px] px-4 flex items-center transition-all duration-300 bg-gray-50 ${error ? "border-red-500" : "border-gray-200"}`}>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(false);
                    }}
                    className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-300 text-[15px] font-medium"
                  />
                </div>
                {error && (
                  <p className="text-[11px] font-medium text-red-500 mt-2 ml-1">Please enter a valid email address.</p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[14px] h-[42px] rounded-full transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-[0.98] mt-4"
            >
              Send OTP
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-4 text-center">
            <div className="flex items-center gap-3 justify-center text-[14px] font-medium text-gray-400 mb-6">
              <div className="h-[1px] w-12 bg-gray-100"></div>
              <span>Login with</span>
              <div className="h-[1px] w-12 bg-gray-100"></div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <button className="flex items-center justify-center w-12 h-12 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 group">
                <FaFacebook size={24} className="text-[#1877F2] group-hover:scale-110 transition-transform" />
              </button>
              <button className="flex items-center justify-center w-12 h-12 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 group">
                <FcGoogle size={24} className="group-hover:scale-110 transition-transform" />
              </button>
              {/* <span className="text-[14px] font-medium text-gray-400 mx-1">or</span>
              <Link href="/signup" className="text-[14px] font-bold text-gray-900 hover:text-[#0054A6] transition-colors underline underline-offset-4 decoration-gray-200">
                Sign Up
              </Link> */}
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-1 text-center">
            <p className="text-[10px] leading-relaxed text-gray-500 px-4">
              By Tapping Send OTP, You Agree To{" "}
              <Link href="/terms" className="hover:underline">Terms And Conditions</Link>{" "}
              And <Link href="/policy/privacy" className="hover:underline">Privacy Policy</Link> Of Electra International
            </p>
          </div>
        </>
      ) : (
        <VerifyOTP
          phoneNumber={loginType === "phone" ? fullPhoneNumber : email}
          onBack={() => setStep("login")}
          onVerify={handleVerify}
        />
      )}
    </div>
  );
}
