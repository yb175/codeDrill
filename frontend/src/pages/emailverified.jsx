// pages/verify-success.jsx
import { MailCheck } from "lucide-react";
export default function VerifyEmailSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl text-center shadow-xl border border-gray-700">
        <MailCheck className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
        <p className="text-gray-300 mb-4">Your account is now active. You can log in to continue.</p>
        <a
          href="/"
          className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}

