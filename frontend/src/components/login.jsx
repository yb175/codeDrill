import React from "react";
import { Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import ErrorToast from "../assets/errorToast";
import axios from "axios";

const LoginForm = ({ onToggleToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loginRequest = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/user/login-with-password",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status != 200) {
        throw new Error(
          response?.data?.response?.data?.message || "Try again later"
        );
      }
      console.log("Login successful:", response.data);
      setErrorMessage("");
    } catch (err) {
      console.log(
        "Login error:",
        err?.response?.data?.message || "Try again later"
      );
      setErrorMessage(err?.response?.data?.message || "Try again later")
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center ">
      {errorMessage && <ErrorToast message={errorMessage} setErrorMessage={setErrorMessage}></ErrorToast>}
      <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-3 md:p-8 shadow-2xl w-full max-w-sm md:max-w-md flex flex-col justify-center">
        {/* Tabs */}
        <div className="flex mb-6">
          <button className="flex-1 py-2 text-white bg-purple-600 rounded-lg mr-2 transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
            Log In
          </button>
          <button
            onClick={onToggleToSignup}
            className="flex-1 py-2 text-gray-300 rounded-lg ml-2 transition-all duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            Sign Up
          </button>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-transparent focus:border-purple-500 transition-colors duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="mb-5 relative">
          {" "}
          {/* 1. Added 'relative' */}
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="User124@"
            className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-transparent focus:border-purple-500 transition-colors duration-200" // 2. Added 'pr-12'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* 3. Added the toggle button */}
          <button
            type="button" // Important: prevents form submission
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-12 text-gray-400 hover:text-gray-200"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Continue Button & Forgot Password */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
          <button
            className="w-full sm:w-auto flex-1 py-3 text-white bg-green-600 rounded-lg transition-all duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => loginRequest(email, password)}
          >
            Continue
          </button>
          <a
            href="#"
            className="text-purple-400 text-sm font-medium hover:underline text-center sm:text-right"
          >
            Forgot password?
          </a>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-600"></span>
          </div>
          <div className="relative px-3 text-sm text-gray-500 bg-gray-800/80 rounded-full">
            or
          </div>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg text-gray-300 transition-colors duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.163 6.83 9.488.5.092.682-.217.682-.483 
                0-.237-.008-.86-.013-1.69-2.782.604-3.37-1.34-3.37-1.34-.454-1.157-1.107-1.464-1.107-1.464-.905-.618.068-.606.068-.606 
                1.002.07 1.53.98 1.53.98.89.97 2.34.69 2.91.528.09-.41.35-.69.64-1.11-2.22-.25-4.55-.11-4.55-4.93 
                0-1.09.38-1.98.99-2.67-.1-.25-.42-1.26.09-2.64 
                0 0 .81-.27 2.64 1.02.77-.213 1.58-.32 2.4-.32.82 0 
                1.63.107 2.4.32 1.83-1.29 2.64-1.02 2.64-1.02.51 1.38.19 2.39.09 2.64.61.69.99 1.58.99 
                2.67 0 4.83-2.33 5.18-4.56 4.93.36.31.68.91.68 
                1.84 0 1.33-.01 2.4-.01 2.72 0 .26.18.57.68.48C17.135 
                18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                clipRule="evenodd"
              />
            </svg>
            Continue with GitHub
          </button>

          <button
            className="w-full flex items-center justify-center px-4 py-3 
  border border-gray-600 rounded-lg text-gray-300 
  transition-all duration-200 hover:bg-gray-700 
  focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            {/* Google G Logo */}
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.68 1.22 9.18 3.6l6.84-6.84C35.6 2.64 30.3 0 24 0 14.62 0 6.51 5.48 2.56 13.44l7.98 6.21C12.3 13.42 17.67 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24.5c0-1.57-.14-3.09-.39-4.56H24v9.13h12.65c-.55 2.98-2.24 5.51-4.77 7.22l7.33 5.69C43.63 38.19 46.5 31.84 46.5 24.5z"
              />
              <path
                fill="#FBBC05"
                d="M10.54 28.65A14.52 14.52 0 0 1 9.5 24c0-1.63.28-3.21.8-4.65l-7.98-6.21A23.97 23.97 0 0 0 0 24c0 3.91.93 7.6 2.56 10.86l7.98-6.21z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.3 0 11.6-2.07 15.47-5.63l-7.33-5.69c-2.04 1.37-4.65 2.19-8.14 2.19-6.33 0-11.7-3.92-13.46-9.44l-7.98 6.21C6.51 42.52 14.62 48 24 48z"
              />
            </svg>
            Continue with Google
          </button>

          <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg text-gray-300 transition-colors duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600">
            <span className="mr-2">
              <Mail size={20} />
            </span>{" "}
            Email Verification
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          New here?{" "}
          <a
            href="#"
            className="text-purple-400 hover:underline"
            onClick={onToggleToSignup}
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
