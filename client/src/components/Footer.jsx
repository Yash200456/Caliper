import React, { useEffect, useState } from 'react';
import { ArrowUp, Compass, Github, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

const productLinks = [
  { label: 'Features', target: 'features' },
  { label: 'Pricing', target: 'pricing' },
  { label: 'How It Works', target: 'products' },
  { label: 'ATS Checker', target: 'top' },
  { label: 'Cover Letter Generator', target: 'top' }
];

const resourceLinks = [
  { label: 'Blog', target: 'resources' },
  { label: 'Resume Guide', target: 'resources' },
  { label: 'Career Tips', target: 'resources' },
  { label: 'Interview Prep', target: 'resources' },
  { label: 'Help Center', target: 'resources' },
  { label: 'API Docs', target: 'resources' }
];

const companyLinks = [
  { label: 'About Us', target: 'about' },
  { label: 'Contact', target: 'top' },
  { label: 'Privacy Policy', target: 'top' },
  { label: 'Terms of Service', target: 'top' },
  { label: 'Careers', target: 'top' }
];

const socialLinks = [
  { label: 'Twitter/X', icon: Twitter, href: '#' },
  { label: 'LinkedIn', icon: Linkedin, href: '#' },
  { label: 'GitHub', icon: Github, href: '#' },
  { label: 'YouTube', icon: Youtube, href: '#' },
  { label: 'Instagram', icon: Instagram, href: '#' }
];

const Footer = ({ onNavClick }) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = (event, target) => {
    if (!onNavClick) return;
    onNavClick(event, target);
  };

  return (
    <>
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black px-8 py-16 text-gray-400">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md shadow-blue-400/30">
                  <Compass className="h-5 w-5" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-white">Caliper</span>
              </div>
              <p className="mt-4 text-sm leading-7">
                AI-powered resume optimization for modern job seekers
              </p>
              <p className="mt-5 text-xs text-gray-500">© 2026 Caliper. All rights reserved.</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Product</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={`#${link.target}`}
                      onClick={(event) => handleLinkClick(event, link.target)}
                      className="transition-colors duration-200 hover:text-blue-400"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Resources</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={`#${link.target}`}
                      onClick={(event) => handleLinkClick(event, link.target)}
                      className="transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Company</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={`#${link.target}`}
                      onClick={(event) => handleLinkClick(event, link.target)}
                      className="transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-700 pt-8">
            <div className="flex justify-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="rounded-full p-2 text-white transition-colors duration-200 hover:bg-gray-700"
                  >
                    <Icon size={24} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </footer>

      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-500 hover:shadow-blue-400/40"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default Footer;
