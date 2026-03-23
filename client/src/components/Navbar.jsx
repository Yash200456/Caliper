import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  FileText,
  HelpCircle,
  LogOut,
  Menu,
  Rocket,
  Settings,
  Sparkles,
  User,
  X
} from 'lucide-react';

const Navbar = ({
  onLogin,
  onGetStarted,
  isLoggedIn = false,
  userEmail = '',
  onLogout,
  onMyScans,
  onSettings,
  onHelp
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const offset = 112;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    setMenuOpen(false);
  };

  const handleNavLinkClick = (event, sectionId) => {
    event.preventDefault();
    scrollToSection(sectionId);
  };

  const initials = useMemo(() => {
    if (!userEmail) return 'U';
    return userEmail.trim().charAt(0).toUpperCase();
  }, [userEmail]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const closeMobile = () => setMenuOpen(false);

  return (
    <motion.nav
      className="sticky top-0 z-50 flex items-center justify-between bg-white/80 px-8 py-4 backdrop-blur-md"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <style>
        {`
          .signup-shine {
            position: relative;
            overflow: hidden;
            background-size: 200% 100%;
            background-position: 0% 50%;
          }
          .signup-shine::after {
            content: '';
            position: absolute;
            top: 0;
            left: -130%;
            width: 50%;
            height: 100%;
            background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.32) 50%, transparent 80%);
            transition: left 0.6s ease;
          }
          .signup-shine:hover {
            background-position: 100% 50%;
          }
          .signup-shine:hover::after {
            left: 130%;
          }
        `}
      </style>

      <div className="text-2xl font-extrabold text-slate-900">Caliper</div>

      <div className="hidden gap-8 md:flex">
        <a
          href="#features"
          onClick={(event) => handleNavLinkClick(event, 'features')}
          className="text-slate-800 transition hover:text-purple-600"
        >
          Features
        </a>
        <a
          href="#pricing"
          onClick={(event) => handleNavLinkClick(event, 'pricing')}
          className="text-slate-800 transition hover:text-purple-600"
        >
          Pricing
        </a>
      </div>

      <div className="hidden items-center gap-4 md:flex">
        {!isLoggedIn ? (
          <>
            <button
              onClick={onLogin}
              className="border-2 border-gray-300 bg-transparent text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-300 focus:ring-4 focus:ring-blue-500/20"
            >
              <User className="mr-2 inline-block h-4 w-4" />
              Log In
            </button>
            <button
              onClick={onGetStarted}
              className="signup-shine inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 px-8 py-2.5 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110 hover:shadow-2xl hover:shadow-blue-500/50"
            >
              <Sparkles className="h-4 w-4" />
              Sign Up
            </button>
          </>
        ) : (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl p-1.5 transition-all duration-300 hover:ring-2 hover:ring-blue-400"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
                {initials}
              </span>
              <ChevronDown className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="absolute right-0 top-full z-50 mt-2 min-w-[250px] rounded-xl border border-slate-200 bg-white p-2 shadow-2xl"
                >
                  <div className="rounded-t-lg bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                    <p className="text-xs uppercase tracking-widest text-blue-100">Signed in as</p>
                    <p className="mt-1 break-all text-sm font-semibold">{userEmail || 'user@caliper.ai'}</p>
                  </div>

                  <div className="my-2 border-t border-slate-200" />

                  <button
                    onClick={onMyScans}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <FileText className="h-4 w-4" />
                    My Scans
                  </button>
                  <button
                    onClick={onSettings}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={onHelp}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Help & Support
                  </button>

                  <div className="my-2 border-t border-slate-200" />

                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <button
        className="inline-flex rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:border-blue-200 hover:text-blue-600 md:hidden"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full border-t border-slate-200 bg-white/95 px-8 py-5 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-3">
              <a
                href="#features"
                onClick={(event) => handleNavLinkClick(event, 'features')}
                className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-50"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={(event) => handleNavLinkClick(event, 'pricing')}
                className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-50"
              >
                Pricing
              </a>

              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      closeMobile();
                      if (onLogin) onLogin();
                    }}
                    className="border-2 border-gray-300 bg-transparent text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-300 focus:ring-4 focus:ring-blue-500/20"
                  >
                    <User className="mr-2 inline-block h-4 w-4" />
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      closeMobile();
                      if (onGetStarted) onGetStarted();
                    }}
                    className="signup-shine inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 px-8 py-2.5 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110 hover:shadow-2xl hover:shadow-blue-500/50"
                  >
                    <Rocket className="h-4 w-4" />
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      closeMobile();
                      if (onMyScans) onMyScans();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-100"
                  >
                    <FileText className="h-4 w-4" />
                    My Scans
                  </button>
                  <button
                    onClick={() => {
                      closeMobile();
                      if (onSettings) onSettings();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-100"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      closeMobile();
                      if (onHelp) onHelp();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-100"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Help & Support
                  </button>
                  <button
                    onClick={() => {
                      closeMobile();
                      if (onLogout) onLogout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
