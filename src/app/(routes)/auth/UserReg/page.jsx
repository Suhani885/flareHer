"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, Calendar, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../../../public/logo.png";
import { Color } from "../../../utils/Colors";
import { Constant, ApiEndpoints } from "../../../utils/ApiConst";

export default function UserReg() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    address: "",
    gender: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    address: "",
    gender: "",
    phoneNumber: "",
    terms: "",
  });
  const router = useRouter();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,16}/;
  const phoneRegex = /^\+?[0-9]{10,15}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.birthdate) {
      newErrors.birthdate = "Birthdate is required";
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password should be 8-16 characters, should contain a number, an uppercase and lowercase letter and a special character!";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and privacy policy";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${Constant.baseURL}${ApiEndpoints.USER_REG}`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          birthdate: formData.birthdate,
          address: formData.address,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Registration successful!");
      setTimeout(() => {
        router.push("/auth/Login");
      }, 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "An error occurred during registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
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

      {/* Registration Form */}
      <div
        className="w-full max-w-lg bg-white p-8 rounded-br-4xl rounded-tl-4xl shadow-md border transition-all duration-300 hover:shadow-lg animate-fadeIn"
        style={{ borderColor: `${Color.secondary.default}30` }}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-58 h-20 relative animate-pulse-subtle">
            <Image
              src={logo}
              alt="Flare Her Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2
            className="text-xl font-bold"
            style={{ color: Color.primary.default }}
          >
            Create Your User Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div
              className="animate-slideInUp"
              style={{ animationDelay: "0.1s" }}
            >
              <label
                htmlFor="firstName"
                className="block text-sm font-medium mb-2"
                style={{ color: Color.text.default }}
              >
                First Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* <User
                    className="h-5 w-5 text-slate-400 group-hover:text-pink-400 transition-colors"
                    style={{ color: `${Color.lightText.default}80` }}
                  /> */}
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full pl-4 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white placeholder-slate-400 transition-colors"
                  placeholder="Jane"
                  style={{
                    borderColor: errors.firstName
                      ? "#f43f5e"
                      : `${Color.secondary.default}50`,
                    color: Color.text.default,
                  }}
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-rose-500 animate-fadeIn">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div
              className="animate-slideInUp"
              style={{ animationDelay: "0.1s" }}
            >
              <label
                htmlFor="lastName"
                className="block text-sm font-medium mb-2"
                style={{ color: Color.text.default }}
              >
                Last Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* <User
                    className="h-5 w-5 text-slate-400 group-hover:text-pink-400 transition-colors"
                    style={{ color: `${Color.lightText.default}80` }}
                  /> */}
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full pl-4 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white placeholder-slate-400 transition-colors"
                  placeholder="Doe"
                  style={{
                    borderColor: errors.lastName
                      ? "#f43f5e"
                      : `${Color.secondary.default}50`,
                    color: Color.text.default,
                  }}
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-rose-500 animate-fadeIn">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="animate-slideInUp" style={{ animationDelay: "0.2s" }}>
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
                className="block w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white placeholder-slate-400 transition-colors"
                placeholder="your@email.com"
                style={{
                  borderColor: errors.email
                    ? "#f43f5e"
                    : `${Color.secondary.default}50`,
                  color: Color.text.default,
                }}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-rose-500 animate-fadeIn">
                {errors.email}
              </p>
            )}
          </div>

          <div
            className="animate-slideInUp"
            style={{ animationDelay: "0.25s" }}
          >
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium mb-2"
              style={{ color: Color.text.default }}
            >
              Phone Number
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone
                  className="h-5 w-5 text-slate-400 group-hover:text-pink-400 transition-colors"
                  style={{ color: `${Color.lightText.default}80` }}
                />
              </div>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white placeholder-slate-400 transition-colors"
                placeholder="1234567890"
                style={{
                  borderColor: errors.phoneNumber
                    ? "#f43f5e"
                    : `${Color.secondary.default}50`,
                  color: Color.text.default,
                }}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-rose-500 animate-fadeIn">
                {errors.phoneNumber}
              </p>
            )}
          </div>

          <div className="animate-slideInUp" style={{ animationDelay: "0.3s" }}>
            <label
              htmlFor="gender"
              className="block text-sm font-medium mb-2"
              style={{ color: Color.text.default }}
            >
              Gender
            </label>
            <div className="relative group">
              <select
                id="gender"
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="block w-full pl-4 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white transition-colors"
                style={{
                  borderColor: errors.gender
                    ? "#f43f5e"
                    : `${Color.secondary.default}50`,
                  color: Color.text.default,
                }}
              >
                <option value="">Select Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            {errors.gender && (
              <p className="mt-1 text-sm text-rose-500 animate-fadeIn">
                {errors.gender}
              </p>
            )}
          </div>

          <div
            className="animate-slideInUp"
            style={{ animationDelay: "0.35s" }}
          >
            <label
              htmlFor="birthdate"
              className="block text-sm font-medium mb-2"
              style={{ color: Color.text.default }}
            >
              Birthdate
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar
                  className="h-5 w-5 text-slate-400 group-hover:text-pink-400 transition-colors"
                  style={{ color: `${Color.lightText.default}80` }}
                />
              </div>
              <input
                id="birthdate"
                name="birthdate"
                type="date"
                required
                value={formData.birthdate}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white placeholder-slate-400 transition-colors"
                style={{
                  borderColor: errors.birthdate
                    ? "#f43f5e"
                    : `${Color.secondary.default}50`,
                  color: Color.text.default,
                }}
              />
            </div>
            {errors.birthdate && (
              <p className="mt-1 text-sm text-rose-500 animate-fadeIn">
                {errors.birthdate}
              </p>
            )}
          </div>

          <div className="animate-slideInUp" style={{ animationDelay: "0.4s" }}>
            <label
              htmlFor="address"
              className="block text-sm font-medium mb-2"
              style={{ color: Color.text.default }}
            >
              Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin
                  className="h-5 w-5 text-slate-400 group-hover:text-pink-400 transition-colors"
                  style={{ color: `${Color.lightText.default}80` }}
                />
              </div>
              <input
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white placeholder-slate-400 transition-colors"
                placeholder="Your full address"
                rows="2"
                style={{
                  borderColor: errors.address
                    ? "#f43f5e"
                    : `${Color.secondary.default}50`,
                  color: Color.text.default,
                }}
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-sm text-rose-500 animate-fadeIn">
                {errors.address}
              </p>
            )}
          </div>

          <div className="animate-slideInUp" style={{ animationDelay: "0.5s" }}>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
              style={{ color: Color.text.default }}
            >
              Password
            </label>
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
                className="block w-full pl-10 pr-10 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white placeholder-slate-300 transition-colors"
                placeholder="••••••••"
                style={{
                  borderColor: errors.password
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
            {errors.password && (
              <p className="mt-1 text-sm text-rose-500 animate-fadeIn">
                {errors.password}
              </p>
            )}
          </div>

          <div className="animate-slideInUp" style={{ animationDelay: "0.6s" }}>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2"
              style={{ color: Color.text.default }}
            >
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock
                  className="h-5 w-5 text-slate-400 transition-colors"
                  style={{ color: `${Color.lightText.default}80` }}
                />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white placeholder-slate-300 transition-colors"
                placeholder="••••••••"
                style={{
                  borderColor: errors.confirmPassword
                    ? "#f43f5e"
                    : `${Color.secondary.default}50`,
                  color: Color.text.default,
                }}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-pink-400 transition-colors"
                style={{ color: `${Color.lightText.default}80` }}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-rose-500 animate-fadeIn">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div
            className="flex items-start mt-6 animate-slideInUp"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded cursor-pointer"
                style={{ accentColor: Color.primary.default }}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="terms"
                style={{ color: Color.text.default }}
                className="cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  href="/privacy"
                  className="underline font-medium"
                  style={{ color: Color.primary.default }}
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
          {errors.terms && (
            <p className="mt-1 text-sm text-rose-500 animate-fadeIn">
              {errors.terms}
            </p>
          )}

          <div className="animate-slideInUp" style={{ animationDelay: "0.8s" }}>
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
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <div
          className="mt-2 text-center animate-fadeIn"
          style={{ animationDelay: "0.9s" }}
        >
          <p className="text-sm" style={{ color: Color.lightText.default }}>
            Already have an account?{" "}
            <Link
              href="/auth/Login"
              className="font-medium hover:text-pink-500 transition-colors"
              style={{ color: Color.primary.default }}
            >
              Sign in
            </Link>
          </p>
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

        .animate-pulse-subtle {
          animation: pulse-subtle 3s infinite;
        }
      `}</style>
    </div>
  );
}
