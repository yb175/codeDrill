import { motion } from "framer-motion";
import { MailCheck, Code, X } from "lucide-react";

const EmailSentOverlay = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 flex items-center justify-center p-4 z-50 
               bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 
               backdrop-blur-md"
  >
    <motion.div
      className="bg-gray-900 text-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl border border-gray-700 relative"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Icon */}
      <div className="flex justify-center mb-4">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: 0, duration: 0.8 }}
          className="bg-purple-600 rounded-full p-4 shadow-lg"
        >
          <MailCheck className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-3 flex items-center justify-center gap-2">
        <Code className="w-6 h-6 text-purple-400 animate-bounce" />
        Verification Email Sent!
      </h2>

      {/* Description */}
      <p className="mb-6 text-gray-300 text-sm">
        A verification email has been sent to your inbox. Please check and follow the instructions to activate your account.
      </p>

      {/* Action button */}
      <button
        onClick={onClose}
        className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300 font-medium flex items-center justify-center gap-2 mx-auto shadow-md"
      >
        <MailCheck className="w-5 h-5" />
        Close
      </button>
    </motion.div>
  </motion.div>
);

export default EmailSentOverlay;
