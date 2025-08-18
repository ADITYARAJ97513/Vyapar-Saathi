import React from "react";
import { Link } from "react-router-dom";
import { Briefcase,  InstagramIcon , Linkedin, Github } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          <div className="mb-10 md:mb-0 flex items-center space-x-3">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 shadow-lg shadow-yellow-500/20">
              <Briefcase className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-wide text-yellow-400 drop-shadow-md">
                Vyapar Saathi
              </h2>
              <p className="text-sm text-gray-400">
                Your Smart Business Companion
              </p>
            </div>
          </div>
          <div className="mb-10 md:mb-0">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">
              Quick Links
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-yellow-400 transition font-medium"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/billing"
                  className="hover:text-yellow-400 transition font-medium"
                >
                  Billing
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-yellow-400 transition font-medium"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/expenses"
                  className="hover:text-yellow-400 transition font-medium"
                >
                  Expenses
                </Link>
              </li>
              <li>
                <Link
                  to="/udhaar"
                  className="hover:text-yellow-400 transition font-medium"
                >
                  Udhaar
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">
              Connect with Developer - Aditya Raj
            </h3>
            <div className="flex space-x-5">
              <a
                href="https://www.instagram.com/adityaraj97512/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gray-700 hover:bg-yellow-500 hover:text-black transition shadow-md"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/adityarajbitmesra/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gray-700 hover:bg-blue-500 transition shadow-md"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/ADITYARAJ97513"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gray-700 hover:bg-white hover:text-black transition shadow-md"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>
            &copy; {currentYear}{" "}
            <span className="font-semibold text-yellow-400">Vyapar Saathi</span>
            . All Rights Reserved.
          </p>
          <p className="mt-1">
            Made with <span className="text-red-500">❤️</span> by Aditya Raj
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
