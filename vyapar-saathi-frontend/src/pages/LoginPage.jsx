import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { Briefcase, Copy } from "lucide-react";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authAPI.login({ email, password });
      onLogin(data);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
      console.error(error);
    }
  };

  const copyDemoCredentials = () => {
    setEmail("abc@gmail.com");
    setPassword("Password");
    toast.success("Demo credentials filled!");
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
          <Briefcase className="w-20 h-20 mb-6 text-yellow-300" />
          <h2 className="text-3xl font-extrabold">Vyapar Saathi</h2>
          <p className="mt-3 text-lg text-center opacity-90">
            Your smart business companion for growth & management
          </p>
        </div>
        <div className="flex flex-col justify-center w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Welcome
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Please login to manage your business
          </p>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-blue-800">Demo Credentials</h3>
              <button
                onClick={copyDemoCredentials}
                className="flex items-center text-xs text-blue-600 hover:text-blue-800"
              >
                <Copy className="w-3 h-3 mr-1" />
                Fill Demo Login
              </button>
            </div>
            <div className="text-sm text-blue-700">
              <p>Email: abc@gmail.com</p>
              <p>Password: Password</p>
            </div>
          </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                required
              />
            </div>
            <div className="text-right text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-800"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 transition-all duration-300"
            >
              Login
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow h-[1px] bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-[1px] bg-gray-300"></div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              Register here
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
        .animate-[gradient_10s_ease_infinite] {
          background-size: 400% 400%;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;