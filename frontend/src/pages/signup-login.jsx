import React, { useState } from 'react';
import LoginForm from '../components/login';
import SignupForm from '../components/signup';
import EmailSentOverlay from '../components/emailSentOverlay';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmailSent(false); // reset overlay when switching forms
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-gray-900">
      {isLogin ? (
        <LoginForm onToggleToSignup={toggleForm} />
      ) : (
        <SignupForm onToggleToLogin={toggleForm} onEmailSent={() => setEmailSent(true)} />
      )}

      {/* Email Sent Overlay */}
      {emailSent && (
        <EmailSentOverlay onClose={() => setEmailSent(false)} />
      )}
    </div>
  );
};

export default AuthPage;