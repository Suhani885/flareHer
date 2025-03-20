"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../../../public/logo.png";
import { Color } from "../../../utils/Colors";
import { Constant, ApiEndpoints } from "../../../utils/ApiConst";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,16}/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") setEmailError("");
    if (name === "password") setPasswordError("");
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      setPasswordError("Password is required");
      return false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password should be 8-16 characters, should contain a number, an uppercase and lowercase letter and a special character!"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${Constant.baseURL}${ApiEndpoints.LOGIN}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Login successful!");
      setTimeout(() => {
        router.push("/ai-analysis/skinType");
      }, 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{
        background: Color.bgGradient.default,
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-0"></div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full px-16">
          <div className="max-w-lg">
            <div className="mb-12 text-center items-center animate-fadeIn">
              <h2
                className="text-4xl font-serif font-light tracking-wide mb-6 leading-tight"
                style={{ color: "#52334A" }}
              >
                <span className="block">Discover Your</span>
                <span
                  className="block mt-1 relative"
                  style={{ color: Color.primary.default }}
                >
                  Authentic Beauty
                  <div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-px w-24"
                    style={{
                      background:
                        "linear-gradient(to right, transparent, #F299B6, transparent)",
                    }}
                  ></div>
                </span>
              </h2>

              <p
                className="text-lg leading-relaxed mt-4"
                style={{ color: Color.lightText.default }}
              >
                Discover our collection of premium haircare & skincare products
                designed by women, for women.
              </p>
            </div>

            {/* Feature cards */}
            <div className="flex flex-col space-y-6">
              <div
                className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-opacity-20 animate-slideInLeft"
                style={{
                  borderColor: Color.secondary.default,
                  animationDelay: "0.1s",
                }}
              >
                <div className="flex items-start">
                  <div
                    className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(228, 83, 125, 0.1), rgba(242, 153, 182, 0.1))",
                    }}
                  >
                    <span style={{ color: Color.primary.default }}>✧</span>
                  </div>
                  <div className="ml-4">
                    <h3
                      className="text-lg font-medium mb-1"
                      style={{ color: "#52334A" }}
                    >
                      Female-led Research
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: Color.lightText.default }}
                    >
                      Products developed by women understanding women's unique
                      needs.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-opacity-20 animate-slideInLeft"
                style={{
                  borderColor: Color.secondary.default,
                  animationDelay: "0.2s",
                }}
              >
                <div className="flex items-start">
                  <div
                    className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(228, 83, 125, 0.1), rgba(242, 153, 182, 0.1))",
                    }}
                  >
                    <span style={{ color: Color.primary.default }}>✧</span>
                  </div>
                  <div className="ml-4">
                    <h3
                      className="text-lg font-medium mb-1"
                      style={{ color: "#52334A" }}
                    >
                      Community Support
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: Color.lightText.default }}
                    >
                      Connect with like-minded women to share experiences and
                      grow together.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-opacity-20 animate-slideInLeft"
                style={{
                  borderColor: Color.secondary.default,
                  animationDelay: "0.3s",
                }}
              >
                <div className="flex items-start">
                  <div
                    className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(228, 83, 125, 0.1), rgba(242, 153, 182, 0.1))",
                    }}
                  >
                    <span style={{ color: Color.primary.default }}>✧</span>
                  </div>
                  <div className="ml-4">
                    <h3
                      className="text-lg font-medium mb-1"
                      style={{ color: "#52334A" }}
                    >
                      Premium Products
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: Color.lightText.default }}
                    >
                      Formulated to work beautifully on all hair and skin types
                      and tones.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className="w-full max-w-md bg-white p-8 rounded-br-4xl rounded-tl-4xl shadow-md border transition-all duration-300 hover:shadow-lg animate-fadeIn"
          style={{ borderColor: `${Color.secondary.default}30` }}
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-58 h-24 relative mb-4 animate-pulse-subtle">
              <Image
                src={logo}
                alt="Flare Her Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              className="animate-slideInUp"
              style={{ animationDelay: "0.1s" }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: Color.text.default }}
              >
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    className="h-5 w-5 text-slate-400 group-hover:text-pink-400 transition-colors"
                    style={{ color: `${Color.lightText.default}80` }}
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => validateEmail(formData.email)}
                  className="block w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white placeholder-slate-400 transition-colors"
                  placeholder="your@email.com"
                  style={{
                    borderColor: emailError
                      ? "#f43f5e"
                      : `${Color.secondary.default}50`,
                    color: Color.text.default,
                  }}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-rose-500 animate-fadeIn">
                  {emailError}
                </p>
              )}
            </div>

            <div
              className="animate-slideInUp"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                  style={{ color: Color.text.default }}
                >
                  Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className="h-5 w-5 text-slate-400 transition-colors"
                    style={{ color: `${Color.lightText.default}80` }}
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => validatePassword(formData.password)}
                  className="block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white placeholder-slate-300 transition-colors"
                  placeholder="••••••••"
                  style={{
                    borderColor: passwordError
                      ? "#f43f5e"
                      : `${Color.secondary.default}50`,
                    color: Color.text.default,
                  }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-pink-400 transition-colors"
                  style={{ color: `${Color.lightText.default}80` }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-rose-500 animate-fadeIn">
                  {passwordError}
                </p>
              )}
            </div>

            <div
              className="animate-slideInUp"
              style={{ animationDelay: "0.3s" }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-all duration-300 shadow-sm hover:shadow-md hover:opacity-90 active:scale-95 transform"
                style={{
                  background: Color.gradient.default,
                  boxShadow: `0 4px 10px ${Color.primary.default}30`,
                }}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div
            className="mt-8 text-center animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            <p className="text-sm" style={{ color: Color.lightText.default }}>
              Don't have an account?{" "}
              <Link
                href="/auth/UserReg"
                className="font-medium hover:text-pink-500 transition-colors"
                style={{ color: Color.primary.default }}
              >
                Create here
              </Link>
            </p>
          </div>

          <div
            className="mt-8 text-center animate-fadeIn"
            style={{ animationDelay: "0.5s" }}
          >
            <p className="text-xs" style={{ color: Color.lightText.default }}>
              &copy; {new Date().getFullYear()} FlareHer. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes pulse-subtle {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 3s infinite;
        }
      `}</style>
    </div>
  );
}
