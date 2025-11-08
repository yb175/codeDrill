// pages/verify-failed.jsx
import { XCircle, ArrowRight } from "lucide-react";
import {Link} from "react-router";

export default function VerifyEmailFailed() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-2xl text-center shadow-xl border border-gray-700 max-w-md w-full relative">
        {/* Icon */}
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">Verification Failed!</h1>

        {/* Description */}
        <p className="text-gray-300 mb-6 text-sm">
          Oops! We couldn't verify your email. The link may have expired or already been used.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {/* Resend Verification */}
          <Link
            href="/resend-verification"
            className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            Resend Verification <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Go to Login */}
          <Link
            href="/login"
            className="text-gray-400 hover:text-white text-sm underline"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
