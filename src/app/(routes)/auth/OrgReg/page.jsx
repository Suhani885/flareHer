"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EntrepreneurSignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessType: "",
    productCategories: [],
    experience: "",
    phone: "",
    agreeTerms: false,
    agreeSellerPolicy: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const businessTypes = [
    "Individual Seller",
    "Small Business",
    "Established Brand",
  ];
  const productCategories = [
    "Skincare",
    "Haircare",
    "Body Care",
    "Facial Oils",
    "Hair Oils",
    "Face Masks",
    "Hair Masks",
    "Scrubs",
    "Soaps",
    "Other",
  ];
  const experienceLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Professional",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "agreeTerms" || name === "agreeSellerPolicy") {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      } else {
        // Handle product categories checkboxes
        setFormData((prev) => {
          const updatedCategories = [...prev.productCategories];
          if (checked) {
            updatedCategories.push(value);
          } else {
            const index = updatedCategories.indexOf(value);
            if (index > -1) {
              updatedCategories.splice(index, 1);
            }
          }
          return {
            ...prev,
            productCategories: updatedCategories,
          };
        });
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.businessName
    ) {
      setError("Name, email, password and business name are required");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (formData.productCategories.length === 0) {
      setError("Please select at least one product category");
      return false;
    }

    if (!formData.agreeTerms || !formData.agreeSellerPolicy) {
      setError(
        "You must agree to both the Terms and Conditions and Seller Policy"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      // This would be replaced with your actual API call to register an entrepreneur
      const response = await fetch("/api/auth/signup/entrepreneur", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }

      // Redirect to entrepreneur onboarding
      router.push("/entrepreneur/onboarding");
    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left side - form */}
            <div className="md:w-3/5 p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-green-800">
                  Create Your Entrepreneur Account
                </h1>
                <p className="text-gray-600 mt-2">
                  Join our marketplace to sell your DIY beauty products
                </p>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-semibold text-green-700 mb-4">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum 8 characters
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h2 className="text-xl font-semibold text-green-700 mb-4">
                    Business Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        htmlFor="businessName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="businessType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Business Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="businessType"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Experience Level
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select experience level</option>
                        {experienceLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Product Categories */}
                <div>
                  <h2 className="text-xl font-semibold text-green-700 mb-4">
                    Product Categories <span className="text-red-500">*</span>
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    Select all that apply
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {productCategories.map((category) => (
                      <div key={category} className="flex items-start">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          name="productCategories"
                          value={category}
                          checked={formData.productCategories.includes(
                            category
                          )}
                          onChange={handleChange}
                          className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agreements */}
                <div className="space-y-3">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor="agreeTerms"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-green-600 hover:text-green-500"
                      >
                        Terms and Conditions
                      </Link>{" "}
                      <span className="text-red-500">*</span>
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeSellerPolicy"
                      name="agreeSellerPolicy"
                      checked={formData.agreeSellerPolicy}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor="agreeSellerPolicy"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      I agree to the{" "}
                      <Link
                        href="/seller-policy"
                        className="text-green-600 hover:text-green-500"
                      >
                        Seller Policy
                      </Link>{" "}
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {isLoading
                      ? "Creating Account..."
                      : "Create Entrepreneur Account"}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="/auth/Login"
                      className="text-green-600 hover:text-green-500 font-medium"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Right side - information */}
            <div className="md:w-2/5 bg-green-700 text-white p-8 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-4">
                Benefits of Joining Our Marketplace
              </h2>

              <ul className="space-y-4">
                <li className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Reach a community of beauty enthusiasts looking for DIY
                    products
                  </span>
                </li>
                <li className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Low marketplace fees compared to other platforms</span>
                </li>
                <li className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Dedicated support for entrepreneurs</span>
                </li>
                <li className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Access to resources, webinars, and community events
                  </span>
                </li>
                <li className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Simple and intuitive seller dashboard</span>
                </li>
              </ul>

              <div className="mt-8 bg-green-600 p-4 rounded-lg">
                <h3 className="font-bold mb-2">
                  Ready to grow your DIY beauty business?
                </h3>
                <p>
                  Join thousands of entrepreneurs already selling on our
                  platform!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
