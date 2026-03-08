import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

const Hero = ({ onPrimary }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <section className="relative flex flex-col lg:flex-row items-center justify-between py-16 lg:py-20 px-8 gap-12 -mt-16" id="hero">
      {/* floating menu button */}
      <div className="absolute top-4 left-4 z-60">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full bg-blue-600/80 text-white hover:bg-blue-700 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        {menuOpen && (
          <div className="mt-2 w-40 bg-white rounded-md shadow-lg text-gray-800">
            <a
              href="#hero"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              About
            </a>
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Features
            </a>
          </div>
        )}
      </div>
      {/* text */}
      <motion.div
        className="flex-1 text-center lg:text-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-900">
          Optimize your resume with{' '}
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            AI precision
          </span>
        </h1>
        <p className="mt-6 text-lg text-slate-700">
          CareerOrbit AI scans your resume against any job listing, uncovers hidden
          keywords and formatting issues, then gives you a precise match score
          — just like a real Applicant Tracking System. Spend minutes, not
          hours, getting your application seen.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <button
            onClick={onPrimary}
            className="relative inline-block px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold shadow-xl hover:scale-105 transform transition-all"
          >
            🚀 Scan your resume
            <span className="absolute inset-0 rounded-full animate-pulse opacity-0 hover:opacity-20 bg-white"></span>
          </button>
        </div>
      </motion.div>
      {/* right side details and ATS preview */}
      <motion.div
        className="flex-1 mb-12 lg:mb-0 mt-12 lg:mt-0"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="282"
                  strokeDashoffset="68"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <span className="relative text-5xl font-bold text-blue-500">76%</span>
            </div>
            <div className="mt-4 px-4 py-2 bg-blue-50 rounded-full">
              <span className="text-sm font-semibold text-blue-600">
                ATS Match Rate
              </span>
            </div>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-800 text-center">
            How CareerOrbit AI Works
          </h3>
          <ul className="mt-4 text-gray-700 space-y-2 list-disc list-inside text-sm">
            <li>Upload your resume and paste a job description</li>
            <li>Our AI analyzes keywords, skills & format</li>
            <li>You receive a real‑time match score and roadmap</li>
          </ul>
          <p className="mt-4 text-gray-600 text-sm">
            Powered by a modern MERN stack and Google’s Gemini models, our
            engine reverse‑engineers job descriptions and provides a
            personalized improvement roadmap. Developers use React & Node.js,
            data is stored in PostgreSQL/Neon, and the heavy lifting is done
            by our AI so you can focus on getting hired.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
