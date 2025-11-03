import React, { useState } from 'react';
import LoginForm from '../components/login';
import SignupForm from '../components/signup';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {isLogin ? (
        <LoginForm onToggleToSignup={toggleForm} />
      ) : (
        <SignupForm onToggleToLogin={toggleForm} />
      )}
    </div>
  );
};

export default AuthPage;