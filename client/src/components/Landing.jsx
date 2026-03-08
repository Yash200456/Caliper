import React from 'react';
import Hero from './Hero';
import FeatureCard from './FeatureCard';
import { Cpu, TrendingUp, Lightbulb } from 'lucide-react';

const Landing = ({ onScan }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 scroll-smooth">
      {/* header with anchors - overlay on top of hero */}
      <header className="absolute top-0 left-0 w-full bg-gray-900/80 backdrop-blur-md shadow-md z-50 py-4">
        <nav className="max-w-6xl mx-auto flex justify-center space-x-8">
          <a href="#hero" className="text-white hover:text-purple-300 transition font-semibold drop-shadow">
            Home
          </a>
          <a href="#about" className="text-white hover:text-purple-300 transition font-semibold drop-shadow">
            About
          </a>
          <a href="#features" className="text-white hover:text-purple-300 transition font-semibold drop-shadow">
            Features
          </a>
        </nav>
      </header>
      <Hero onPrimary={onScan} />
      {/* about section */}
      <section id="about" className="py-20 px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">About CareerOrbit AI</h2>
          <p className="text-lg text-slate-700 mb-8">
            CareerOrbit AI was created to bridge the gap between talented
            professionals and the automated systems that screen their resumes.
            By leveraging advanced AI to interpret job descriptions and resume
            content, we give you the insights recruiters see and the direction
            you need to improve.
          </p>
          <button
            onClick={onScan}
            className="inline-flex px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg transition"
          >
            🚀 Scan Your Resume
          </button>
        </div>
      </section>
      <section id="features" className="py-20 px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Cpu />}
              title="ATS Scoring"
              description="Check how well your resume passes Applicant Tracking Systems."
            />
            <FeatureCard
              icon={<TrendingUp />}
              title="Job Matching"
              description="See how closely your skills align with job requirements."
            />
            <FeatureCard
              icon={<Lightbulb />}
              title="Smart Tips"
              description="Receive actionable advice to improve your resume instantly."
            />
          </div>
        </div>
      </section>
      {/* Pricing or other sections could go here */}
      <footer className="mt-auto py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} CareerOrbit AI. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
