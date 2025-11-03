import React from 'react';

const SignupForm = ({ onToggleToLogin }) => {
  return (
    <div className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-2xl w-full max-w-md border border-gray-700">
      <div className="flex mb-6">
        <button
          onClick={onToggleToLogin}
          className="flex-1 py-2 text-gray-300 rounded-lg mr-2 transition-all duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          Log In
        </button>
        <button className="flex-1 py-2 text-white bg-purple-600 rounded-lg ml-2 transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
          Sign Up
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-400 text-sm font-semibold mb-2 sr-only">Full Name</label>
        <input
          type="text"
          id="name"
          placeholder="Your Full Name"
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-transparent focus:border-purple-500 transition-colors duration-200"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="signupEmail" className="block text-gray-400 text-sm font-semibold mb-2 sr-only">Email</label>
        <input
          type="email"
          id="signupEmail"
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-transparent focus:border-purple-500 transition-colors duration-200"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="signupPassword" className="block text-gray-400 text-sm font-semibold mb-2 sr-only">Password</label>
        <input
          type="password"
          id="signupPassword"
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-transparent focus:border-purple-500 transition-colors duration-200"
        />
      </div>

      <div className="mb-6">
        <button className="w-full py-3 text-white bg-green-600 rounded-lg transition-all duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
          Create Account
        </button>
      </div>

      {/* --- Removed the "or" divider and social login buttons --- */}

      <p className="mt-8 text-center text-gray-400 text-sm">
        Already have an account? <a href="#" onClick={onToggleToLogin} className="text-purple-400 hover:underline">Log In</a>
      </p>
    </div>
  );
};

export default SignupForm;