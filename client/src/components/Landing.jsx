import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import FeatureCard from './FeatureCard';
import { Cpu, TrendingUp, Lightbulb } from 'lucide-react';

const Landing = ({ onScan }) => {
  const handleWatchDemo = () => {
    // placeholder: maybe scroll to video section
    window.alert('Demo coming soon!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar onLogin={() => window.alert('Please log in')} onGetStarted={onScan} />
      <Hero onPrimary={onScan} onSecondary={handleWatchDemo} />
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
