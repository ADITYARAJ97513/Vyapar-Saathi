import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { KeyRound } from 'lucide-react'; 

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authAPI.getQuestion(email);
      navigate('/reset-password', { state: { email, securityQuestion: data.securityQuestion } });
    } catch (error) {
      toast.error('No account found with that email address.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute w-[200%] h-[200%] bg-gradient-to-br from-blue-900 via-purple-800 to-pink-900 animate-[gradient_10s_ease_infinite]"></div>
        <svg
          className="absolute bottom-0 left-0 w-full h-auto text-white/10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="currentColor"
            d="M0,160L40,170.7C80,181,160,203,240,197.3C320,192,400,160,480,160C560,160,640,192,720,186.7C800,181,880,139,960,133.3C1040,128,1120,160,1200,181.3C1280,203,1360,213,1400,218.7L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div className="relative w-full max-w-4xl flex bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden z-10">
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-10 relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')]"></div>
          <KeyRound className="w-20 h-20 mb-6 text-yellow-300" />
          <h2 className="text-3xl font-extrabold">Forgot Password?</h2>
          <p className="mt-3 text-lg text-center opacity-90">
            No worries, we'll help you get back into your account.
          </p>
        </div>
        <div className="flex flex-col justify-center w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Password Recovery
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Please enter your email to begin the recovery process.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 transition-all duration-300"
            >
              Continue
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow h-[1px] bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-[1px] bg-gray-300"></div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-\\[gradient_10s_ease_infinite\\] {
          background-size: 400% 400%;
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;