import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Footer from './Footer';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileUp,
  Flame,
  GraduationCap,
  LineChart,
  LoaderCircle,
  Lock,
  Menu,
  Play,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  UserCircle2,
  Users,
  X,
  Zap
} from 'lucide-react';

const navLinks = [
  { label: 'Products', target: 'products' },
  { label: 'Features', target: 'features' },
  { label: 'Pricing', target: 'pricing' },
  { label: 'Resources', target: 'resources' },
  { label: 'About', target: 'about' },
  { label: 'Sign In', target: 'signin' }
];

const sectionIds = ['top', 'features', 'products', 'pricing', 'about', 'resources', 'signin'];

const featurePills = [
  {
    key: 'ats',
    title: 'ATS Match Report',
    icon: BarChart3,
    emoji: '📊',
    description: 'See how your resume performs against ATS scoring benchmarks.'
  },
  {
    key: 'optimize',
    title: 'One-Click Optimize',
    icon: Sparkles,
    emoji: '⚡',
    description: 'Apply AI-powered edits to improve impact and keyword targeting.'
  },
  {
    key: 'skills',
    title: 'Skill Gap Analysis',
    icon: Target,
    emoji: '🎯',
    description: 'Identify missing must-have skills and where to place them.'
  },
  {
    key: 'insights',
    title: 'Career Insights',
    icon: TrendingUp,
    emoji: '📈',
    description: 'Track your optimization progress and interview readiness.'
  },
  {
    key: 'tracker',
    title: 'Application Tracker',
    icon: ClipboardList,
    emoji: '📱',
    description: 'Manage applications, reminders, and follow-up actions.'
  }
];

const featurePreview = {
  ats: {
    heading: 'Precision ATS Breakdown',
    body: 'Caliper maps your resume to job requirements and provides section-level compatibility for skills, structure, and keyword fit.',
    points: ['Keyword coverage map', 'Formatting risk flags', 'Weighted match scoring']
  },
  optimize: {
    heading: 'One-Click Rewrite Suggestions',
    body: 'Get concise bullet rewrites tuned to the target role with stronger action verbs and measurable outcomes.',
    points: ['Impact-oriented language', 'Metric enhancement suggestions', 'Role-specific optimization']
  },
  skills: {
    heading: 'Skill Gap Prioritization',
    body: 'Quickly identify which missing skills are most likely to improve match score and callback probability.',
    points: ['Must-have vs optional skills', 'Placement recommendations', 'Priority roadmap']
  },
  insights: {
    heading: 'Career Momentum Dashboard',
    body: 'Monitor resume performance over time and discover role-fit trends to improve your search strategy.',
    points: ['Performance timeline', 'Role alignment trends', 'Feedback summaries']
  },
  tracker: {
    heading: 'Application Command Center',
    body: 'Track status across applications with reminders and interview prep checkpoints in one place.',
    points: ['Pipeline tracking', 'Smart reminders', 'Interview note capture']
  }
};

const testimonials = [
  {
    name: 'Maya Chen',
    role: 'Product Designer',
    company: 'Brightline',
    quote: 'Caliper helped me reshape my resume around each role. I started getting interview requests within days.',
    rating: 5
  },
  {
    name: 'Ethan Rivera',
    role: 'Data Analyst',
    company: 'NorthPeak Labs',
    quote: 'The skill gap analysis was incredibly practical. I knew exactly what to fix, and my match score jumped fast.',
    rating: 5
  },
  {
    name: 'Priya Nair',
    role: 'Software Engineer',
    company: 'Asterix Cloud',
    quote: 'One-click optimize saved me hours every week. The suggestions were specific and high quality.',
    rating: 5
  }
];

const testimonialsShowcase = [
  {
    name: 'Sarah Johnson',
    title: 'Software Engineer at Google',
    company: 'Google',
    initials: 'SJ',
    quote:
      'Caliper helped me identify exactly what was missing in my resume. I went from 2% callback rate to 65% in just 2 weeks!'
  },
  {
    name: 'Michael Chen',
    title: 'Product Manager at Amazon',
    company: 'Amazon',
    initials: 'MC',
    quote:
      'The AI-powered insights were spot on. I updated my resume based on Caliper\'s suggestions and landed 3 interviews in the first week.'
  },
  {
    name: 'Emily Rodriguez',
    title: 'Data Analyst at Goldman Sachs',
    company: 'Goldman Sachs',
    initials: 'ER',
    quote:
      'As a career changer, I had no idea how to optimize my resume for ATS. Caliper made it so easy - got my dream job in fintech!'
  }
];

const aboutStats = [
  { icon: TrendingUp, value: 10000, suffix: '+', label: 'Resumes Analyzed' },
  { icon: Trophy, value: 85, suffix: '%', label: 'Avg Score Improvement' },
  { icon: Users, value: 92, suffix: '%', label: 'Callback Rate' }
];

const CountUpValue = ({ value, suffix, start }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }

    let raf;
    let startTs;

    const step = (ts) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / 1400, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(value * eased));

      if (progress < 1) {
        raf = window.requestAnimationFrame(step);
      }
    };

    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [start, value]);

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
};

const Landing = ({ onScan }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const [activeFeature, setActiveFeature] = useState('ats');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [ctaState, setCtaState] = useState('idle');
  const [pricingAnnual, setPricingAnnual] = useState(false);
  const [typedHeadline, setTypedHeadline] = useState('');
  const [demoThumbLoaded, setDemoThumbLoaded] = useState(false);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const demoRef = useRef(null);
  const productsRef = useRef(null);
  const pricingRef = useRef(null);
  const testimonialsRef = useRef(null);
  const aboutRef = useRef(null);
  const resourcesRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const demoInView = useInView(demoRef, { once: true, amount: 0.2 });
  const productsInView = useInView(productsRef, { once: true, amount: 0.2 });
  const pricingInView = useInView(pricingRef, { once: true, amount: 0.2 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 });
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.2 });
  const resourcesInView = useInView(resourcesRef, { once: true, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.2 });

  const baseTransition = { duration: 0.6, ease: 'easeOut' };

  useEffect(() => {
    const onScroll = () => {
      setHasShadow(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: '-35% 0px -50% 0px', threshold: 0.1 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  useEffect(() => {
    const ticker = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(ticker);
  }, []);

  useEffect(() => {
    const headlineTarget = 'More Interviews';
    let idx = 0;

    const typer = window.setInterval(() => {
      idx += 1;
      setTypedHeadline(headlineTarget.slice(0, idx));

      if (idx >= headlineTarget.length) {
        window.clearInterval(typer);
      }
    }, 85);

    return () => window.clearInterval(typer);
  }, []);

  const handlePrimaryCta = () => {
    if (ctaState !== 'idle') return;

    setCtaState('loading');
    setTimeout(() => setCtaState('success'), 800);
    setTimeout(() => {
      if (onScan) onScan();
      setCtaState('idle');
    }, 1400);
  };

  const handleNavClick = (event, target) => {
    event.preventDefault();
    setMenuOpen(false);

    const targetEl = document.getElementById(target);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemoClick = () => {
    window.alert('Demo video coming soon!');
  };

  const ctaLabel =
    ctaState === 'loading'
      ? 'Analyzing...'
      : ctaState === 'success'
        ? 'Ready to Scan →'
        : 'Scan Your Resume →';

  return (
    <div className="scroll-smooth bg-white text-[#1F2937]">
      <style>
        {`
          @keyframes floatDrift {
            0% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-10px) translateX(6px); }
            100% { transform: translateY(0px) translateX(0px); }
          }
          @keyframes bgShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes heroGradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes pulseCta {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes spinLoader {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes iconBounce {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(5deg) scale(1.1); }
            100% { transform: rotate(0deg) scale(1); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(24px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes blinkCaret {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
          .float-shape { animation: floatDrift 8s ease-in-out infinite; }
          .float-shape-slow { animation: floatDrift 11s ease-in-out infinite; }
          .animated-bg { background-size: 200% 200%; animation: bgShift 10s ease infinite; }
          .pulse-cta { animation: pulseCta 2.8s ease-in-out infinite; }
          .mobile-menu-open { animation: slideInRight 0.22s ease-out; }
          .hero-gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            background-size: 200% 200%;
            animation: heroGradientMove 16s ease-in-out infinite;
          }
          .hero-particles {
            background-image: radial-gradient(circle, rgba(255,255,255,0.38) 1px, transparent 1px);
            background-size: 22px 22px;
          }
          .hero-glow-text {
            color: #f8fbff;
            text-shadow: 0 0 14px rgba(96, 165, 250, 0.55), 0 0 28px rgba(167, 139, 250, 0.45);
          }
          .ripple-btn {
            position: relative;
            overflow: hidden;
            isolation: isolate;
          }
          .ripple-btn::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle, rgba(255,255,255,0.38) 8%, transparent 42%);
            transform: scale(0);
            opacity: 0;
            transition: transform 0.45s ease, opacity 0.45s ease;
            pointer-events: none;
          }
          .ripple-btn:active::after {
            transform: scale(3);
            opacity: 1;
            transition: transform 0s, opacity 0s;
          }
          .cta-btn {
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .cta-btn:hover {
            transform: translateY(-2px);
          }
          .loading-spinner {
            animation: spinLoader 0.8s linear infinite;
          }
          .typing-caret {
            display: inline-block;
            margin-left: 2px;
            color: rgba(255, 255, 255, 0.92);
            animation: blinkCaret 1s step-end infinite;
          }
          .nav-link-line::after {
            content: ''; display: block; height: 2px;
            background: #2563EB; transform: scaleX(0);
            transform-origin: left; transition: transform 0.35s ease;
          }
          .nav-link-line:hover::after,
          .nav-link-line.nav-link-active::after { transform: scaleX(1); }
          .step-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .step-card:hover { transform: scale(1.02) translateY(-5px); box-shadow: 0 22px 44px rgba(37,99,235,0.13); }
          .feature-card { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease; }
          .feature-card:hover { transform: scale(1.03); box-shadow: 0 18px 40px rgba(37,99,235,0.11); border-color: #93c5fd; background-color: #f8fbff; }
          .feature-icon { transition: transform 0.3s ease; }
          .feature-card:hover .feature-icon,
          .feature-pill:hover .feature-icon { animation: iconBounce 0.45s ease; transform: rotate(5deg) scale(1.1); }
          .feature-pill { transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease, transform 0.3s ease; }
          .lazy-fade { opacity: 0; transition: opacity 0.5s ease; }
          .lazy-fade.is-loaded { opacity: 1; }
          .dots-bg { background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px); background-size: 28px 28px; }
          .grid-bg { background-image: linear-gradient(rgba(148,163,184,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.1) 1px, transparent 1px); background-size: 32px 32px; }
        `}
      </style>

      <header
        className={`sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg transition-all duration-300 ${
          hasShadow ? 'shadow-lg shadow-slate-900/10' : 'shadow-sm shadow-slate-200/60'
        }`}
      >
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center px-5 lg:px-8">
          <div className="flex shrink-0 items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md shadow-blue-300/40">
              <Compass className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#10B981]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">Caliper</span>
          </div>

          <nav className="mx-auto hidden items-center gap-7 pl-8 lg:flex">
            {navLinks.map((item) => {
              const isActive = activeSection === item.target;
              return (
                <a
                  key={item.label}
                  href={`#${item.target}`}
                  onClick={(event) => handleNavClick(event, item.target)}
                  className={`nav-link-line relative pb-1 text-[15px] font-medium transition-colors duration-200 ${
                    isActive ? 'nav-link-active' : ''
                  } ${
                    isActive ? 'text-[#2563EB]' : 'text-slate-600 hover:text-[#2563EB]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="ml-auto hidden lg:block">
            <button className="cta-btn ripple-btn rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-300/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/40">
              Get Started →
            </button>
          </div>

          <button
            className="ml-auto inline-flex rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:border-blue-200 hover:text-[#2563EB] lg:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu-open border-t border-slate-100 bg-white/95 px-5 py-5 backdrop-blur-lg lg:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((item) => {
                const isActive = activeSection === item.target;
                return (
                  <a
                    key={item.label}
                    href={`#${item.target}`}
                    onClick={(event) => handleNavClick(event, item.target)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive ? 'bg-blue-50 text-[#2563EB]' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <button className="cta-btn ripple-btn mt-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-bold text-white">
                Get Started →
              </button>
            </div>
          </div>
        )}
      </header>

      <motion.section
        id="top"
        ref={heroRef}
        className="relative overflow-hidden px-5 pb-24 pt-28 sm:px-8 sm:pb-32 sm:pt-36"
        initial={{ opacity: 0, y: 36 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ ...baseTransition, delay: 0.5 }}
      >
        <div className="hero-gradient-bg pointer-events-none absolute inset-0 z-0" />
        <div className="hero-particles pointer-events-none absolute inset-0 z-0 opacity-20" />

        <div className="float-shape absolute left-8 top-20 z-0 h-28 w-28 rounded-full bg-blue-200/35 blur-2xl" />
        <div className="float-shape-slow absolute right-16 top-24 z-0 h-36 w-36 rounded-3xl bg-purple-200/30 blur-2xl" />
        <div className="float-shape absolute bottom-20 left-[22%] z-0 h-16 w-16 rounded-full bg-cyan-200/35 blur-xl" />
        <div className="float-shape-slow absolute bottom-28 right-[20%] z-0 h-24 w-24 rotate-12 rounded-xl bg-pink-200/35 blur-xl" />
        <div className="float-shape absolute right-[36%] top-44 z-0 h-12 w-12 rotate-45 rounded-md bg-white/30 blur-lg" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="max-w-4xl rounded-3xl border border-white/20 bg-white/10 p-8 shadow-[0_24px_80px_rgba(30,41,59,0.25)] backdrop-blur-lg sm:p-10 md:p-12">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-sm">
              <Flame className="h-4 w-4 text-orange-500" />
              AI-Powered Resume Intelligence
            </p>

            <h1 className="font-['Inter','Poppins',sans-serif] text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
              Optimize Your Resume to Land{' '}
              <span className="hero-glow-text inline-block min-h-[1.2em] min-w-[10ch]">
                {typedHeadline}
                <span className="typing-caret">|</span>
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-blue-50/95">
              Caliper AI analyzes your resume against job descriptions using advanced AI to give you an instant match score and actionable feedback.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                onClick={handlePrimaryCta}
                disabled={ctaState === 'loading'}
                className="cta-btn ripple-btn pulse-cta inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 text-base font-bold text-white shadow-2xl shadow-blue-400/40 transition-all duration-300 hover:shadow-blue-500/50 disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto"
              >
                {ctaState === 'loading' ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="loading-spinner h-5 w-5" />
                    {ctaLabel}
                  </span>
                ) : ctaState === 'success' ? (
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    {ctaLabel}
                  </span>
                ) : (
                  ctaLabel
                )}
              </button>
              <button className="cta-btn ripple-btn inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-white/50 bg-white/15 px-8 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/70 hover:bg-white/20 sm:w-auto">
                <Play className="h-4 w-4 fill-current" />
                Watch Demo
              </button>
            </div>

            <p className="mt-5 text-sm font-medium text-blue-100/90">
              ✔ No CC Required &nbsp;&bull;&nbsp; ✔ 2 Min Setup &nbsp;&bull;&nbsp; ✔ Free Forever
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="features"
        ref={featuresRef}
        className="relative scroll-mt-28 overflow-hidden bg-white px-5 py-24 sm:px-8"
        initial={{ opacity: 0, y: 28 }}
        animate={featuresInView ? { opacity: 1, y: 0 } : {}}
        transition={baseTransition}
      >
        {/* Decorative SVG blobs */}
        <svg className="pointer-events-none absolute -left-32 top-0 h-96 w-96 opacity-[0.18]" viewBox="0 0 400 400" fill="none"><ellipse cx="200" cy="200" rx="200" ry="160" fill="#BFDBFE"/></svg>
        <svg className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 opacity-[0.18]" viewBox="0 0 400 400" fill="none"><ellipse cx="200" cy="200" rx="180" ry="200" fill="#E9D5FF"/></svg>

        <div className="relative mx-auto w-full max-w-7xl">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-blue-600">Platform</p>
          <h2 className="mt-3 text-center font-['Inter','Poppins',sans-serif] text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            All-in-One Career Optimization
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-slate-600">
            Every tool you need to turn a generic resume into a targeted, interview-winning document.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {featurePills.map((feature, idx) => {
              const Icon = feature.icon;
              const selected = activeFeature === feature.key;
              const isMidPill = idx === 2;
              return (
                <div key={feature.key} className="relative">
                  {isMidPill && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-2 py-0.5 text-[10px] font-bold text-white whitespace-nowrap">
                      Most Popular
                    </span>
                  )}
                  <button
                    onClick={() => setActiveFeature(feature.key)}
                    className={`feature-pill inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      selected
                        ? 'border-blue-300 bg-blue-50 text-[#2563EB] shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-blue-200 hover:text-[#2563EB]'
                    }`}
                    title={feature.description}
                  >
                    <span className="text-lg">{feature.emoji}</span>
                    <Icon className="feature-icon h-4 w-4" />
                    {feature.title}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-9 grid gap-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-sm lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">{featurePreview[activeFeature].heading}</h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">{featurePreview[activeFeature].body}</p>
              <ul className="mt-5 space-y-3">
                {featurePreview[activeFeature].points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#10B981]" />
                    <span className="text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Live Preview</span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  92% Match
                </span>
              </div>

              {/* Resume card mockup */}
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-base font-bold text-slate-900">John Doe</p>
                <p className="mt-0.5 text-xs text-slate-500">Software Engineer &nbsp;|&nbsp; React Developer</p>
                <div className="my-3 h-px bg-slate-100" />
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Skills: </span>
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">React</span>
                  {' '}
                  <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">Node.js</span>
                  {' '}
                  <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-700">TypeScript</span>
                  {' '}
                  <span className="rounded bg-orange-100 px-1.5 py-0.5 text-xs font-medium text-orange-700">AWS</span>
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-700">Experience: </span>
                  5+ years in full-stack development
                </p>
              </div>

              {/* Progress bars */}
              <div className="mt-4 space-y-2.5">
                <div>
                  <div className="mb-1 flex justify-between text-[11px] font-medium text-slate-500">
                    <span>Keyword Match</span><span className="text-blue-600">92%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 w-[92%] rounded-full bg-blue-500" />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-[11px] font-medium text-slate-500">
                    <span>Skills Coverage</span><span className="text-emerald-600">85%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 w-[85%] rounded-full bg-emerald-500" />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-[11px] font-medium text-slate-500">
                    <span>ATS Compatibility</span><span className="text-purple-600">78%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 w-[78%] rounded-full bg-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="demo"
        ref={demoRef}
        className="relative scroll-mt-28 overflow-hidden bg-white px-5 py-24 sm:px-8"
        initial={{ opacity: 0, y: 24 }}
        animate={demoInView ? { opacity: 1, y: 0 } : {}}
        transition={baseTransition}
      >
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-gradient-to-br from-blue-200/40 to-purple-200/30 blur-3xl" />

        <div className="relative mx-auto w-full max-w-7xl">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-blue-600">Product Demo</p>
          <h2 className="mt-3 text-center font-['Inter','Poppins',sans-serif] text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            See Caliper in Action
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-slate-600">
            Watch how our AI analyzes your resume in seconds
          </p>

          <div className="mt-14 grid items-center gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                Experience the full workflow before you upload your first resume.
              </h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                In this quick walkthrough, you will see exactly how Caliper transforms a generic resume into a targeted, ATS-friendly version with practical, actionable guidance.
              </p>

              <ul className="mt-6 space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#10B981]" />
                  <span>Upload resume in seconds</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#10B981]" />
                  <span>Instant ATS compatibility score</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#10B981]" />
                  <span>Detailed improvement suggestions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#10B981]" />
                  <span>Skill gap analysis</span>
                </li>
              </ul>

              <button
                onClick={handlePrimaryCta}
                disabled={ctaState === 'loading'}
                className="cta-btn ripple-btn mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 text-sm font-bold text-white shadow-md shadow-blue-300/40 transition-all duration-300 hover:shadow-blue-400/50 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {ctaState === 'loading' && <LoaderCircle className="loading-spinner h-4 w-4" />}
                Try It Free
              </button>
            </div>

            <div className="lg:col-span-3">
              <button
                onClick={handleDemoClick}
                aria-label="Play product demo"
                className="group relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-0 text-left shadow-[0_24px_55px_rgba(30,64,175,0.28)] transition-all duration-300 hover:shadow-[0_30px_65px_rgba(59,130,246,0.32)]"
              >
                <span className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  2 min watch
                </span>

                <div className="relative h-[320px] w-full md:h-[360px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0" />

                  {!demoThumbLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-slate-200/35" />
                  )}
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80"
                    alt="Resume analysis dashboard preview"
                    loading="lazy"
                    onLoad={() => setDemoThumbLoaded(true)}
                    className={`lazy-fade absolute inset-0 h-full w-full object-cover ${demoThumbLoaded ? 'is-loaded' : ''}`}
                  />

                  <div className="absolute left-8 top-8 w-[65%] rounded-xl border border-white/25 bg-white/80 p-5 shadow-lg backdrop-blur-sm blur-[1px]">
                    <div className="h-3 w-28 rounded bg-slate-300" />
                    <div className="mt-4 h-2 w-full rounded bg-slate-200" />
                    <div className="mt-2 h-2 w-[92%] rounded bg-slate-200" />
                    <div className="mt-2 h-2 w-[80%] rounded bg-slate-200" />
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="h-16 rounded bg-blue-100" />
                      <div className="h-16 rounded bg-purple-100" />
                    </div>
                  </div>

                  <div className="absolute bottom-7 right-8 w-[45%] rounded-lg border border-white/25 bg-white/80 p-3 shadow-md backdrop-blur-sm blur-[0.6px]">
                    <div className="h-2 w-20 rounded bg-slate-300" />
                    <div className="mt-3 h-2 w-full rounded bg-slate-200" />
                    <div className="mt-2 h-2 w-[88%] rounded bg-slate-200" />
                  </div>

                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/35 bg-white/20 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-1 h-8 w-8 fill-white text-white" />
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="products"
        ref={productsRef}
        className="scroll-mt-28 bg-[#F9FAFB] px-5 py-24 sm:px-8"
        initial={{ opacity: 0, y: 24 }}
        animate={productsInView ? { opacity: 1, y: 0 } : {}}
        transition={baseTransition}
      >
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-blue-600">Process</p>
          <h2 className="mt-3 text-center font-['Inter','Poppins',sans-serif] text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-slate-600">
            Three simple steps to a resume that gets noticed.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                number: '01',
                icon: FileUp,
                title: 'Upload Resume',
                body: 'Drop your resume in seconds. We parse your experience, skills, and impact statements with precision.'
              },
              {
                number: '02',
                icon: Briefcase,
                title: 'Paste Job Description',
                body: 'Add your target role to compare required skills and keyword relevance line-by-line.'
              },
              {
                number: '03',
                icon: LineChart,
                title: 'Get Instant Feedback',
                body: 'Receive match score, suggestions, and a practical optimization roadmap immediately.'
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  className="step-card group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
                  initial={{ opacity: 0, y: 24 }}
                  animate={productsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ ...baseTransition, delay: index * 0.1 }}
                >
                  {/* Top blue accent border */}
                  <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-500 to-purple-500" />

                  {/* Large gradient step number */}
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-xl font-extrabold text-white shadow-md shadow-blue-300/40">
                    {step.number}
                  </div>

                  {/* Large icon with light blue circle */}
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-[#2563EB]">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">{step.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="pricing"
        ref={pricingRef}
        className="scroll-mt-28 bg-gradient-to-br from-white via-blue-50/40 to-purple-50/30 px-5 py-24 sm:px-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={pricingInView ? { opacity: 1, scale: 1 } : {}}
        transition={baseTransition}
      >
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-blue-600">Pricing</p>
          <h2 className="mt-3 text-center font-['Inter','Poppins',sans-serif] text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-slate-600">
            Start free and upgrade when you need deeper optimization workflows.
          </p>

          {/* Annual / Monthly toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!pricingAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button
              onClick={() => setPricingAnnual((p) => !p)}
              className={`relative h-7 w-14 rounded-full transition-colors duration-300 ${pricingAnnual ? 'bg-blue-600' : 'bg-slate-200'}`}
              aria-label="Toggle annual pricing"
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${pricingAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-medium ${pricingAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
              Annual
              <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">Save 20%</span>
            </span>
          </div>

          <div className="mt-12 grid items-center gap-6 md:grid-cols-3">
            {/* Starter */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Starter</p>
              <p className="mt-5 text-6xl font-extrabold text-slate-900">$0</p>
              <p className="mt-1 text-sm text-slate-500">Forever free</p>
              <ul className="mt-7 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#10B981]" />3 scans/week</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#10B981]" />ATS score</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#10B981]" />Basic suggestions</li>
              </ul>
              <button className="cta-btn ripple-btn mt-8 w-full rounded-xl border-2 border-slate-300 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-blue-500 hover:text-blue-600">
                Get Started Free
              </button>
            </div>

            {/* Pro — lifted */}
            <div className="-mt-4 rounded-2xl border-2 border-[#2563EB] bg-white p-8 shadow-2xl shadow-blue-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-300/60 md:-mt-6">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-xs font-bold text-white">
                <Zap className="h-3 w-3" />
                Most Popular
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#2563EB]">Pro</p>
              <p className="mt-5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-6xl font-extrabold text-transparent">
                ${pricingAnnual ? '15' : '19'}
              </p>
              <p className="mt-1 text-sm text-slate-500">per month{pricingAnnual ? ', billed annually' : ''}</p>
              <ul className="mt-7 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#10B981]" />Unlimited scans</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#10B981]" />One-click optimize</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#10B981]" />Priority support</li>
              </ul>
              <button className="cta-btn ripple-btn mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-300/40 transition-all duration-300 hover:shadow-blue-400/50">
                Start Pro Trial →
              </button>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Enterprise</p>
              <p className="mt-5 text-5xl font-extrabold text-slate-900">Custom</p>
              <p className="mt-1 text-sm text-slate-500">for teams &amp; universities</p>
              <ul className="mt-7 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#10B981]" />Admin analytics</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#10B981]" />Bulk onboarding</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#10B981]" />Dedicated success manager</li>
              </ul>
              <button className="cta-btn ripple-btn mt-8 w-full rounded-xl border-2 border-slate-300 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-blue-500 hover:text-blue-600">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={testimonialsRef}
        className="scroll-mt-28 bg-[#F9FAFB] px-5 py-24 sm:px-8"
        initial={{ opacity: 0, y: 24 }}
        animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
        transition={baseTransition}
      >
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-blue-600">Success Stories</p>
          <h2 className="mt-3 text-center font-['Inter','Poppins',sans-serif] text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Loved by Job Seekers Worldwide
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-slate-600">
            See how Caliper helped professionals land their dream jobs
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonialsShowcase.map((item) => (
              <article
                key={item.name}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 text-4xl leading-none text-blue-200">“</div>
                <p className="min-h-[120px] text-base leading-relaxed text-slate-700">{item.quote}</p>

                <div className="mt-5 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={`${item.name}-${idx}`} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white shadow-sm">
                      {item.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.title}</p>
                    </div>
                  </div>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    {item.company}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="about"
        ref={aboutRef}
        className="scroll-mt-28 bg-[#F9FAFB] px-5 py-24 sm:px-8"
        initial={{ opacity: 0, y: 24 }}
        animate={aboutInView ? { opacity: 1, y: 0 } : {}}
        transition={baseTransition}
      >
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">About Caliper</p>
            <h2 className="mt-4 font-['Inter','Poppins',sans-serif] text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
              Show That You&apos;re the<br />Perfect Match
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Our mission is to help job seekers move from guesswork to clarity. Caliper combines AI analysis with practical guidance so your resume communicates the right story to recruiters and ATS systems.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {aboutStats.map(({ icon: Icon, value, suffix, label }) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <Icon className="mx-auto mb-2 h-6 w-6 text-[#2563EB]" />
                  <p className="text-3xl font-extrabold text-[#2563EB]">
                    <CountUpValue value={value} suffix={suffix} start={aboutInView} />
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Resume Snippet</p>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="rounded-md bg-white p-3">Led product launch improving retention by 22%.</div>
                <div className="rounded-md bg-white p-3">
                  Built <span className="rounded bg-emerald-100 px-1 text-emerald-700">SQL</span> and{' '}
                  <span className="rounded bg-emerald-100 px-1 text-emerald-700">Python</span> dashboards.
                </div>
                <div className="relative rounded-md bg-white p-3">
                  Collaborated with engineering to improve release velocity.
                  <div className="absolute -right-2 -top-10 w-44 rounded-lg border border-blue-100 bg-white p-2 text-xs text-slate-600 shadow-lg">
                    <p className="font-semibold text-[#2563EB]">ADD SKILL</p>
                    <p>Add: A/B Testing, KPI Forecasting</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Skill Match</p>
              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-slate-600"><span>Technical Skills</span><span>88%</span></div>
                  <div className="h-2 rounded-full bg-slate-100"><div className="h-2 w-[88%] rounded-full bg-[#10B981]" /></div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-slate-600"><span>Role Keywords</span><span>72%</span></div>
                  <div className="h-2 rounded-full bg-slate-100"><div className="h-2 w-[72%] rounded-full bg-[#2563EB]" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="resources"
        ref={resourcesRef}
        className="scroll-mt-28 bg-white px-5 py-24 sm:px-8"
        initial={{ opacity: 0, y: 24 }}
        animate={resourcesInView ? { opacity: 1, y: 0 } : {}}
        transition={baseTransition}
      >
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-blue-600">Resources</p>
          <h2 className="mt-3 text-center font-['Inter','Poppins',sans-serif] text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Learn &amp; Grow
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-slate-600">
            Explore practical guides, expert content, and support resources to keep your job search moving.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { title: 'Blog', body: 'Weekly resume strategies, hiring insights, and interview prep articles.' },
              { title: 'Guides', body: 'Step-by-step templates for role-specific resumes and keyword targeting.' },
              { title: 'Help Center', body: 'Get fast answers, troubleshooting, and onboarding walkthroughs.' }
            ].map((r) => (
              <div key={r.title} className="feature-card rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">{r.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{r.body}</p>
                <span className="mt-5 inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-blue-600 transition-all duration-200 hover:gap-2">
                  Learn more <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-slate-100 bg-gradient-to-br from-blue-50/60 to-purple-50/40 p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-[#2563EB] shadow-sm">
              <UserCircle2 className="h-10 w-10" />
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-slate-700">&quot;{testimonials[activeTestimonial].quote}&quot;</p>
            <div className="mt-5 flex justify-center gap-1">
              {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, idx) => (
                <Star key={idx} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-5 text-lg font-bold text-slate-900">{testimonials[activeTestimonial].name}</p>
            <p className="text-sm text-slate-500">
              {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${activeTestimonial === index ? 'w-7 bg-[#2563EB]' : 'w-2.5 bg-slate-300'}`}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="signin"
        ref={ctaRef}
        className="scroll-mt-28 relative overflow-hidden px-5 py-24 text-white sm:px-8"
        initial={{ opacity: 0, x: -40 }}
        animate={ctaInView ? { opacity: 1, x: 0 } : {}}
        transition={baseTransition}
      >
        <div className="animated-bg absolute inset-0 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900" />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-10" />
        <div className="relative mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm md:p-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-200">
            <Users className="h-4 w-4" />
            Join 10,000+ professionals already optimizing their careers
          </div>
          <h2 className="font-['Inter','Poppins',sans-serif] text-4xl font-extrabold tracking-tight sm:text-5xl">
            Ready to Optimize Your Resume?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-blue-100">
            Get your AI-powered match score, skill gap analysis, and one-click optimization — all free.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={handlePrimaryCta}
              disabled={ctaState === 'loading'}
              className="cta-btn ripple-btn inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-white px-12 py-5 text-lg font-bold text-[#2563EB] shadow-2xl transition-all duration-300 hover:shadow-white/20 disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto"
            >
              {ctaState === 'loading' ? (
                <>
                  <LoaderCircle className="loading-spinner h-5 w-5" />
                  Analyzing...
                </>
              ) : (
                'Start Free Analysis →'
              )}
            </button>
            <button className="cta-btn ripple-btn inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-10 py-5 text-base font-semibold text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10 sm:w-auto">
              <Play className="h-4 w-4 fill-current" />
              Watch Demo
            </button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs font-medium text-blue-200">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5"><Lock className="h-3.5 w-3.5" /> Secure &amp; Private</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> GDPR Compliant</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5"><GraduationCap className="h-3.5 w-3.5" /> No Credit Card Required</span>
          </div>
        </div>
      </motion.section>

      <Footer onNavClick={handleNavClick} />
    </div>
  );
};

export default Landing;
