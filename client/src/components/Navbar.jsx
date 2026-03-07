import React from 'react';
import { motion } from 'framer-motion';

const Navbar = ({ onLogin, onGetStarted }) => {
  return (
    <motion.nav
      className="backdrop-blur-md bg-white/30 sticky top-0 z-50 px-8 py-4 flex items-center justify-between"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* logo */}
      <div className="text-2xl font-extrabold text-slate-900">
        CareerOrbit <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">AI</span>
      </div>
      {/* center links */}
      <div className="hidden md:flex gap-8">
        <a href="#features" className="text-slate-800 hover:text-purple-600 transition">
          Features
        </a>
        <a href="#pricing" className="text-slate-800 hover:text-purple-600 transition">
          Pricing
        </a>
      </div>
      {/* right buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={onLogin}
          className="text-slate-800 hover:text-purple-600 transition"
        >
          Log In
        </button>
        <button
          onClick={onGetStarted}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transform transition"
        >
          Get Started
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
