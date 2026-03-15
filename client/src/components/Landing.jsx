import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileUp,
  Flame,
  GraduationCap,
  LineChart,
  Lock,
  Menu,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserCircle2,
  X
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

const Landing = ({ onScan }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const [activeFeature, setActiveFeature] = useState('ats');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [ctaState, setCtaState] = useState('idle');

  useEffect(() => {
    const onScroll = () => setHasShadow(window.scrollY > 10);
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
    const revealTargets = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
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
    console.warn(`Section with id "${target}" not found. Scrolled to top.`);
  };

  const ctaLabel =
    ctaState === 'loading'
      ? 'Analyzing...'
      : ctaState === 'success'
        ? 'Ready to Scan'
        : 'Scan Your Resume For Free';

  return (
    <div className="scroll-smooth bg-white text-[#1F2937]">
      <style>
        {`
          @keyframes floatDrift {
            0% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-10px) translateX(6px); }
            100% { transform: translateY(0px) translateX(0px); }
          }
          .float-shape { animation: floatDrift 8s ease-in-out infinite; }
          .float-shape-slow { animation: floatDrift 11s ease-in-out infinite; }
          .reveal { opacity: 0; transform: translateY(20px); transition: opacity .7s ease, transform .7s ease; }
          .reveal.is-revealed { opacity: 1; transform: translateY(0); }
        `}
      </style>

      <header
        className={`sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-lg transition-shadow duration-300 ${
          hasShadow ? 'shadow-[0_10px_25px_rgba(15,23,42,0.08)]' : ''
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1200px] items-center px-5 py-4 lg:px-8">
          <div className="flex shrink-0 items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0066FF] text-white shadow-lg shadow-blue-300/40">
              <Compass className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#10B981]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Caliper</span>
          </div>

          <nav className="mx-auto hidden items-center gap-7 pl-8 lg:flex">
            {navLinks.map((item) => {
              const isActive = activeSection === item.target;
              return (
                <a
                  key={item.label}
                  href={`#${item.target}`}
                  onClick={(event) => handleNavClick(event, item.target)}
                  className={`text-[15px] font-medium transition ${
                    isActive ? 'text-[#2563EB]' : 'text-slate-600 hover:text-[#2563EB]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="ml-auto hidden lg:block">
            <button className="rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300/50">
              Get Started
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
          <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((item) => {
                const isActive = activeSection === item.target;
                return (
                  <a
                    key={item.label}
                    href={`#${item.target}`}
                    onClick={(event) => handleNavClick(event, item.target)}
                    className={`py-1 text-sm font-medium ${isActive ? 'text-[#2563EB]' : 'text-slate-700'}`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <button className="mt-2 rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white">
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      <section
        id="top"
        className="scroll-mt-28 relative overflow-hidden bg-gradient-to-br from-white via-[#F5F9FF] to-[#ECF4FF] px-5 pb-[100px] pt-[120px] sm:px-8"
      >
        <div className="float-shape absolute left-10 top-24 h-20 w-20 rounded-full bg-blue-100/60" />
        <div className="float-shape-slow absolute right-14 top-36 h-24 w-24 rounded-2xl bg-indigo-100/60" />
        <div className="float-shape absolute bottom-16 left-[20%] h-4 w-36 rounded-full bg-blue-200/50" />

        <div className="relative mx-auto w-full max-w-[1200px]">
          <div className="max-w-4xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/75 px-4 py-2 text-sm font-semibold text-blue-700">
              <Flame className="h-4 w-4" />
              AI-Powered Resume Intelligence
            </p>

            <h1 className="font-['Poppins',sans-serif] text-5xl font-bold leading-[1.1] text-slate-900 sm:text-6xl">
              Optimize Your Resume to Land{' '}
              <span className="bg-gradient-to-r from-[#2563EB] via-[#0066FF] to-violet-500 bg-clip-text text-transparent">
                More Interviews
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Caliper AI analyzes your resume against job descriptions using advanced AI to give you an instant match score and actionable feedback.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={handlePrimaryCta}
                disabled={ctaState === 'loading'}
                className="inline-flex h-14 items-center justify-center rounded-lg bg-[#2563EB] px-9 text-base font-semibold text-white shadow-lg shadow-blue-300/60 transition hover:scale-[1.02] hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-85"
              >
                {ctaState === 'success' ? (
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    {ctaLabel}
                  </span>
                ) : (
                  ctaLabel
                )}
              </button>
              <span className="text-sm text-slate-500">No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-28 bg-white px-5 py-20 sm:px-8" data-reveal>
        <div className="mx-auto w-full max-w-[1200px]">
          <h2 className="text-center font-['Poppins',sans-serif] text-3xl font-semibold text-slate-900 sm:text-4xl">
            All-in-One Career Optimization Platform
          </h2>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {featurePills.map((feature) => {
              const Icon = feature.icon;
              const selected = activeFeature === feature.key;
              return (
                <button
                  key={feature.key}
                  onClick={() => setActiveFeature(feature.key)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition ${
                    selected
                      ? 'border-blue-300 bg-blue-50 text-[#2563EB] shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-blue-200 hover:text-[#2563EB]'
                  }`}
                  title={feature.description}
                >
                  <span>{feature.emoji}</span>
                  <Icon className="h-4 w-4" />
                  {feature.title}
                </button>
              );
            })}
          </div>

          <div className="mt-9 grid gap-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 shadow-sm lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">{featurePreview[activeFeature].heading}</h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{featurePreview[activeFeature].body}</p>
              <ul className="mt-5 space-y-2">
                {featurePreview[activeFeature].points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Live Preview</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Optimized</span>
              </div>
              <div className="space-y-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                <div className="h-3 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-200" />
                <div className="h-3 w-2/3 rounded bg-blue-200" />
                <div className="h-3 w-5/6 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="scroll-mt-28 bg-[#F9FAFB] px-5 py-20 sm:px-8" data-reveal>
        <div className="mx-auto w-full max-w-[1200px]">
          <h2 className="text-center font-['Poppins',sans-serif] text-3xl font-semibold text-slate-900 sm:text-4xl">
            How It Works
          </h2>

          <div className="relative mt-12 grid gap-6 md:grid-cols-3">
            <div className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-14 hidden h-[2px] bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-300 md:block" />

            {[
              {
                number: '1',
                icon: FileUp,
                title: 'Upload Resume',
                body: 'Drop your resume in seconds. We parse your experience, skills, and impact statements.'
              },
              {
                number: '2',
                icon: Briefcase,
                title: 'Paste Job Description',
                body: 'Add your target role to compare required skills and keyword relevance line-by-line.'
              },
              {
                number: '3',
                icon: LineChart,
                title: 'Get Instant Feedback',
                body: 'Receive match score, suggestions, and a practical optimization roadmap immediately.'
              }
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-lg font-bold text-white">
                    {step.number}
                  </div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-28 bg-white px-5 py-20 sm:px-8" data-reveal>
        <div className="mx-auto w-full max-w-[1200px]">
          <h2 className="text-center font-['Poppins',sans-serif] text-3xl font-semibold text-slate-900 sm:text-4xl">Pricing</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
            Start free and upgrade when you need deeper optimization workflows.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-7 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Starter</p>
              <p className="mt-4 text-4xl font-bold text-slate-900">$0</p>
              <p className="mt-1 text-sm text-slate-500">Forever free</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#10B981]" />3 scans/week</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#10B981]" />ATS score</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#10B981]" />Basic suggestions</li>
              </ul>
            </div>

            <div className="rounded-2xl border-2 border-[#2563EB] bg-blue-50 p-7 shadow-md">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">Pro</p>
              <p className="mt-4 text-4xl font-bold text-slate-900">$19</p>
              <p className="mt-1 text-sm text-slate-500">per month</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#10B981]" />Unlimited scans</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#10B981]" />One-click optimize</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#10B981]" />Priority support</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-7 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Team</p>
              <p className="mt-4 text-4xl font-bold text-slate-900">Custom</p>
              <p className="mt-1 text-sm text-slate-500">for universities and bootcamps</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#10B981]" />Admin analytics</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#10B981]" />Bulk onboarding</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#10B981]" />Dedicated success manager</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-28 bg-[#F9FAFB] px-5 py-20 sm:px-8" data-reveal>
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">About Caliper</p>
            <h2 className="mt-4 font-['Poppins',sans-serif] text-4xl font-semibold leading-tight text-slate-900">
              Show That You&apos;re the Perfect Match
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Our mission is to help job seekers move from guesswork to clarity. Caliper combines AI analysis with practical guidance so your resume communicates the right story to recruiters and ATS systems.
            </p>
            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-3xl font-bold text-[#2563EB]">10,000+</p>
                <p className="text-xs font-semibold text-slate-500">Resumes Analyzed</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-3xl font-bold text-[#2563EB]">85%</p>
                <p className="text-xs font-semibold text-slate-500">Avg Score Improvement</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-3xl font-bold text-[#2563EB]">92%</p>
                <p className="text-xs font-semibold text-slate-500">Callback Rate</p>
              </div>
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
      </section>

      <section id="resources" className="scroll-mt-28 bg-white px-5 py-20 sm:px-8" data-reveal>
        <div className="mx-auto w-full max-w-[1200px]">
          <h2 className="text-center font-['Poppins',sans-serif] text-3xl font-semibold text-slate-900 sm:text-4xl">Resources</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
            Explore practical guides, expert content, and support resources to keep your job search moving.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-xl font-semibold text-slate-900">Blog</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Weekly resume strategies, hiring insights, and interview prep articles.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-xl font-semibold text-slate-900">Guides</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Step-by-step templates for role-specific resumes and keyword targeting.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-xl font-semibold text-slate-900">Help Center</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Get fast answers, troubleshooting, and onboarding walkthroughs.</p>
            </div>
          </div>

          <div className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-[#2563EB]">
              <UserCircle2 className="h-9 w-9" />
            </div>
            <p className="mt-6 text-lg leading-8 text-slate-700">&quot;{testimonials[activeTestimonial].quote}&quot;</p>
            <div className="mt-5 flex justify-center gap-1">
              {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, idx) => (
                <Star key={idx} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-5 text-lg font-semibold text-slate-900">{testimonials[activeTestimonial].name}</p>
            <p className="text-sm text-slate-500">
              {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2.5 rounded-full transition ${activeTestimonial === index ? 'w-7 bg-[#2563EB]' : 'w-2.5 bg-slate-300'}`}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="signin" className="scroll-mt-28 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-5 py-20 text-white sm:px-8" data-reveal>
        <div className="mx-auto w-full max-w-[1200px] rounded-2xl border border-white/15 bg-white/5 p-8 text-center backdrop-blur-sm md:p-12">
          <h2 className="font-['Poppins',sans-serif] text-3xl font-semibold sm:text-4xl">Ready to Optimize Your Resume?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-blue-100 sm:text-lg">
            Join thousands of job seekers who landed their dream roles
          </p>
          <button
            onClick={handlePrimaryCta}
            className="mt-8 inline-flex h-14 items-center justify-center rounded-lg bg-white px-9 text-base font-semibold text-[#2563EB] transition hover:scale-[1.02] hover:shadow-xl"
          >
            Start Free Analysis
          </button>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs font-semibold text-blue-100">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/25 px-3 py-1">
              <Lock className="h-3.5 w-3.5" />
              Secure
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/25 px-3 py-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Private
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/25 px-3 py-1">
              <GraduationCap className="h-3.5 w-3.5" />
              No Credit Card Required
            </span>
          </div>
        </div>
      </section>

      <footer className="bg-[#1a1a1a] px-5 pb-8 pt-14 text-slate-300 sm:px-8">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold text-white">
              <Compass className="h-6 w-6 text-blue-400" />
              Caliper
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Precision resume optimization for ambitious professionals targeting their next breakthrough role.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Product</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><a href="#features" onClick={(event) => handleNavClick(event, 'features')} className="hover:text-white">Features</a></li>
              <li><a href="#pricing" onClick={(event) => handleNavClick(event, 'pricing')} className="hover:text-white">Pricing</a></li>
              <li><a href="#products" onClick={(event) => handleNavClick(event, 'products')} className="hover:text-white">How It Works</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Resources</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><a href="#resources" onClick={(event) => handleNavClick(event, 'resources')} className="hover:text-white">Blog</a></li>
              <li><a href="#resources" onClick={(event) => handleNavClick(event, 'resources')} className="hover:text-white">Help Center</a></li>
              <li><a href="#about" onClick={(event) => handleNavClick(event, 'about')} className="hover:text-white">About Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>hello@caliper.ai</li>
              <li className="flex gap-3 text-slate-300">
                <span className="cursor-pointer rounded-md border border-slate-600 px-2 py-1 hover:border-blue-400 hover:text-blue-300">X</span>
                <span className="cursor-pointer rounded-md border border-slate-600 px-2 py-1 hover:border-blue-400 hover:text-blue-300">LI</span>
                <span className="cursor-pointer rounded-md border border-slate-600 px-2 py-1 hover:border-blue-400 hover:text-blue-300">GH</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-12 flex w-full max-w-[1200px] flex-col items-center justify-between gap-4 border-t border-slate-700/80 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Caliper. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#top" onClick={(event) => handleNavClick(event, 'top')} className="hover:text-slate-300">Privacy</a>
            <a href="#top" onClick={(event) => handleNavClick(event, 'top')} className="hover:text-slate-300">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
