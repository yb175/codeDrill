import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be less than 50 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be less than 20 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, {
      message:
        "Password must contain at least one special character (@, $, !, %, *, ?, &)",
    }),
});

const SignupForm = ({ onToggleToLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data) => console.log(data);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-2xl w-full max-w-md border border-gray-700">
      {/* Tabs */}
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

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <div className="mb-4">
          <input
            type="text"
            {...register("name")}
            placeholder="Your Full Name"
            className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.name ? "focus:ring-red-500" : "focus:ring-purple-500"
            } border border-transparent transition-colors duration-200`}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.email ? "focus:ring-red-500" : "focus:ring-purple-500"
            } border border-transparent transition-colors duration-200`}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`w-full px-4 py-3 pr-12 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.password ? "focus:ring-red-500" : "focus:ring-purple-500"
            } border border-transparent transition-colors duration-200`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-400 hover:text-gray-200 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="mb-6">
          <button
            className="w-full py-3 text-white bg-green-600 rounded-lg transition-all duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            type="submit"
          >
            Create Account
          </button>
        </div>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-gray-400 text-sm">
        Already have an account?{" "}
        <a
          href="#"
          onClick={onToggleToLogin}
          className="text-purple-400 hover:underline"
        >
          Log In
        </a>
      </p>
    </div>
  );
};

export default SignupForm;