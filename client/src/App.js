import React, { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, Info, Lightbulb, Sparkles, Upload, X } from 'lucide-react';
import './App.css';

// new landing components
import Landing from './components/Landing';

const App = () => {
  const [currentView, setCurrentView] = useState('home');

  // resume analysis state
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');

  const [scans, setScans] = useState([]);

  const [cover, setCover] = useState('');
  const [coverLoading, setCoverLoading] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadAnnouncement, setUploadAnnouncement] = useState('');
  const [uploadTimestamp, setUploadTimestamp] = useState(null);

  const resultRef = React.useRef(null);

  const downloadPdf = () => {
    if (resultRef.current) {
      html2pdf().from(resultRef.current).set({
        margin:       10,
        filename:     'caliper-report.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).save();
    }
  };

  // load scans when token becomes available or when history view opened
  const fetchScans = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/scans', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScans(res.data);
    } catch (err) {
      console.error('failed to fetch scans', err);
    }
  };

  React.useEffect(() => {
    // automatically fetch scans if we start on history page after login
    if (currentView === 'history' && token) {
      fetchScans();
    }
  }, [currentView, token]);

  // also pull latest history any time a token is present (e.g. on reload)
  React.useEffect(() => {
    if (token) {
      fetchScans();
    }
  }, [token]);

  const generateCover = async () => {
    if (!result || !result.resume_text || !result.jd) return;
    setCoverLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/cover', {
        resume_text: result.resume_text,
        jd: result.jd
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCover(res.data.letter);
    } catch (err) {
      console.error(err);
      alert('Failed to generate cover letter.');
    }
    setCoverLoading(false);
  };

  const handleUpload = async () => {
    if (!file || !jd) return alert("Please provide both a Resume and a Job Description!");
    if (!token) return alert('Please log in to save your scan history.');
    setLoading(true);
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jd', jd);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // backend adds scanId, label, resume_text, and we still want to remember the job description
      setResult({ ...response.data, label: response.data.label || 'Untitled', jd });
      setCurrentView('results');
      // refresh history so the new scan appears
      fetchScans();
    } catch (err) {
      console.error(err);
      alert("Backend error: Ensure Node.js is running on port 5000.");
    }
    setLoading(false);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let url = 'http://localhost:5000/api/signup';
      if (currentView === 'login') url = 'http://localhost:5000/api/login';

      const res = await axios.post(url, { email, password });
      setToken(res.data.token);
      setUserEmail(res.data.user.email || email);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', res.data.user.email || email);
      setEmail('');
      setPassword('');
      setCurrentView('dashboard');

      // fetch history now that we're authenticated
      fetchScans();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Authentication failed');
    }
  };

  const logout = () => {
    setToken('');
    setUserEmail('');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setScans([]);
    setCurrentView('home');
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setUploadTimestamp(new Date());
    setUploadAnnouncement(`Selected file ${selectedFile.name}`);
  };

  const handleFileRemove = () => {
    if (!file) return;
    setUploadAnnouncement(`Removed file ${file.name}`);
    setFile(null);
    setUploadTimestamp(null);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    setIsDraggingFile(false);
    const droppedFile = event.dataTransfer?.files?.[0];
    handleFileSelect(droppedFile);
  };

  const completedScans = scans.length;
  const successRate = completedScans
    ? Math.min(
        100,
        Math.round(scans.reduce((sum, scan) => sum + (scan?.result?.match_score || 0), 0) / completedScans)
      )
    : 0;
  const canAnalyze = Boolean(file && jd.trim()) && !loading;
  const jdLength = jd.length;
  const jdTooShort = jdLength > 0 && jdLength < 100;
  const fileSizeLabel = file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '';
  const fileExt = file?.name?.split('.').pop()?.toLowerCase() || '';
  const fileTypeLabel = fileExt === 'pdf' ? 'PDF' : fileExt === 'docx' || fileExt === 'doc' ? 'DOCX' : 'FILE';
  const sampleJD = `We are hiring a Frontend Engineer with strong React and JavaScript experience.\n\nResponsibilities:\n- Build reusable UI components and improve application performance\n- Collaborate with design and backend teams to deliver features\n- Write clean, testable, and maintainable code\n\nRequirements:\n- 2+ years of React experience\n- Strong knowledge of HTML, CSS, JavaScript, and REST APIs\n- Experience with Git and modern frontend tooling\n- Excellent communication and problem-solving skills`;

  const currentStep = loading ? 3 : jd.trim() ? 3 : file ? 2 : 1;
  const stepItems = [
    { id: 1, label: 'Upload' },
    { id: 2, label: 'Paste JD' },
    { id: 3, label: 'Analyze' }
  ];

  React.useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && currentView === 'dashboard' && canAnalyze) {
        event.preventDefault();
        handleUpload();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentView, canAnalyze, handleUpload]);

  return (
    <div className="page-container">
      
      {/* --- THE NAVBAR (Now with Global Back Arrow) --- */}
      {currentView !== 'home' && (
      <nav className="navbar">
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          
          {/* Back Arrow Symbol (Only shows if NOT on home page) */}
          {currentView !== 'home' && (
            <div 
              onClick={() => setCurrentView('home')} 
              style={{cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569', paddingRight: '10px'}}
              title="Back to Home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </div>
          )}

          <div onClick={() => setCurrentView('home')} style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px'}}>
            <h1 style={{margin: 0, fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px'}}>
              Caliper
            </h1>
            <div style={{background: '#eff6ff', color: '#3b82f6', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'}}>Reva ISE Edition</div>
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          {token ? (
            <>
              <span style={{color: '#475569', fontSize: '14px'}}>Hi, {userEmail.split('@')[0]}</span>
              <button className="btn-ghost" onClick={() => setCurrentView('history')}>My Scans</button>
              <button className="btn-ghost" onClick={logout}>Log Out</button>
            </>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => setCurrentView('login')}>Log In</button>
              <button className="btn-pill" onClick={() => setCurrentView('signup')}>Sign Up</button>
            </>
          )}
        </div>
      </nav>
      )}

      {/* --- 0. THE LANDING PAGE (homepage) --- */}
      {currentView === 'home' && (
        <Landing onScan={() => setCurrentView('dashboard')} />
      )}

      {/* --- 1. THE DASHBOARD VIEW --- */}
      {currentView === 'dashboard' && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            {!token && (
              <div className="mb-8 flex flex-wrap items-center gap-2 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
                <Info className="h-4 w-4 text-yellow-700" aria-hidden="true" />
                <span>Log in to save your scans and access history.</span>
                <button
                  onClick={() => setCurrentView('login')}
                  className="font-semibold text-blue-600 underline-offset-2 transition hover:underline"
                >
                  Log In
                </button>
              </div>
            )}

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-12">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Hi, {userEmail || 'there'} 👋</h1>
              <p className="mt-2 text-base text-gray-600">Let&apos;s optimize your resume for your dream job</p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
              >
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xl sm:p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    <div className="flex items-center justify-between gap-2">
                      {stepItems.map((step, index) => {
                        const completed = currentStep > step.id;
                        const active = currentStep === step.id;

                        return (
                          <React.Fragment key={step.id}>
                            <div className="flex items-center gap-2">
                              <span
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                  completed
                                    ? 'bg-green-500 text-white'
                                    : active
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-gray-200 text-gray-500'
                                }`}
                              >
                                {completed ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                              </span>
                              <span className={`text-sm font-medium ${active ? 'text-blue-700' : 'text-gray-500'}`}>{step.label}</span>
                            </div>
                            {index < stepItems.length - 1 && (
                              <div className={`h-1 flex-1 rounded-full ${currentStep > step.id ? 'bg-green-400' : 'bg-gray-200'}`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="mb-8"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">1</span>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Upload Your Resume</h2>
                        <p className="text-sm text-gray-500">PDF or DOCX format, max 5MB</p>
                      </div>
                    </div>

                    <div
                      onDragOver={(event) => {
                        event.preventDefault();
                        setIsDraggingFile(true);
                      }}
                      onDragLeave={() => setIsDraggingFile(false)}
                      onDrop={handleFileDrop}
                      className={`rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                        isDraggingFile
                          ? 'animate-bounce border-blue-500 bg-blue-100/50'
                          : 'border-blue-300 bg-blue-50/50 hover:border-blue-500 hover:bg-blue-100/50'
                      }`}
                    >
                      <Upload className="mx-auto h-12 w-12 text-blue-600" aria-hidden="true" />
                      <p className="mt-4 text-base font-medium text-gray-800">
                        Drag &amp; drop your resume here or click to browse
                      </p>
                      <p className="mt-1 text-sm text-gray-500">Supported formats: PDF, DOCX</p>

                      <div className="mt-5">
                        <input
                          id="dashboard-file-upload"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(event) => handleFileSelect(event.target.files?.[0])}
                          className="hidden"
                          aria-label="Upload resume file"
                        />
                        <label
                          htmlFor="dashboard-file-upload"
                          className="inline-flex cursor-pointer items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          Browse Files
                        </label>
                      </div>

                      {file && (
                        <div className="mx-auto mt-5 max-w-2xl rounded-xl border border-blue-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <span className={`mt-0.5 rounded-lg px-2 py-1 text-xs font-bold ${fileTypeLabel === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                {fileTypeLabel}
                              </span>
                              <FileText className="h-5 w-5 text-blue-600" aria-hidden="true" />
                              <div>
                                <p className="max-w-[220px] truncate font-semibold text-gray-900 sm:max-w-[340px]">{file.name}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                  {fileSizeLabel} • Uploaded {uploadTimestamp ? uploadTimestamp.toLocaleString() : 'just now'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => document.getElementById('dashboard-file-upload')?.click()}
                                className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
                              >
                                Re-upload
                              </button>
                              <button
                                type="button"
                                onClick={handleFileRemove}
                                aria-label="Remove selected file"
                                className="rounded p-1 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      <p className="sr-only" aria-live="polite">{uploadAnnouncement}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="mb-6"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">2</span>
                      <h2 className="text-lg font-semibold text-gray-900">Paste Job Description</h2>
                    </div>

                    <label htmlFor="job-description" className="sr-only">Job Description</label>
                    <textarea
                      id="job-description"
                      value={jd}
                      onChange={(event) => setJd(event.target.value)}
                      placeholder="Paste the job description from the posting..."
                      className="min-h-[200px] w-full rounded-xl border-2 border-gray-200 p-4 text-base leading-relaxed text-gray-800 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className={`${jdTooShort ? 'text-orange-500' : 'text-gray-500'}`}>{jdLength} / 5000 characters</span>
                      {jdTooShort && <span className="text-orange-500">Add more details for better analysis</span>}
                    </div>

                    <button
                      type="button"
                      onClick={() => setJd(sampleJD)}
                      className="mt-3 text-sm font-semibold text-blue-600 transition hover:underline"
                    >
                      Use Sample Job Description
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <button
                      onClick={handleUpload}
                      disabled={!canAnalyze}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-12 py-4 text-lg font-bold text-white transition-all duration-300 sm:w-auto ${
                        canAnalyze
                          ? 'animate-pulse bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:scale-105 hover:shadow-2xl'
                          : 'cursor-not-allowed bg-gradient-to-r from-blue-400 to-purple-400 opacity-50'
                      }`}
                    >
                      {loading ? (
                        <>
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Analyze Resume
                        </>
                      )}
                    </button>
                    <p className="mt-3 text-sm text-gray-500">Press Ctrl+Enter to analyze</p>

                    {loading && (
                      <div className="mt-6 space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
                        <div className="space-y-2">
                          <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                          <div className="h-3 w-11/12 animate-pulse rounded bg-gray-200" />
                          <div className="h-3 w-9/12 animate-pulse rounded bg-gray-200" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="h-20 animate-pulse rounded-lg bg-gray-200" />
                          <div className="h-20 animate-pulse rounded-lg bg-gray-200" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>

              <motion.aside
                className="lg:col-span-1"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
              >
                <div className="sticky top-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    Quick Tips
                  </h3>

                  <ul className="space-y-3">
                    {[
                      'Use a professional resume format',
                      'Include relevant keywords from the job description',
                      'Quantify your achievements with numbers',
                      'Keep it concise (1-2 pages max)',
                      'Proofread for spelling and grammar'
                    ].map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#10B981]" aria-hidden="true" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-900">Your Progress</p>
                    {completedScans === 0 ? (
                      <div className="mt-3 rounded-lg border border-dashed border-gray-200 bg-white p-4 text-center">
                        <Sparkles className="mx-auto h-6 w-6 text-blue-500" aria-hidden="true" />
                        <p className="mt-2 text-sm text-gray-600">Complete your first scan to see your progress</p>
                      </div>
                    ) : (
                      <>
                        <div className="mt-3 space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Scans completed</span>
                            <span className="font-semibold text-gray-900">{completedScans}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Success rate</span>
                            <span className="font-semibold text-gray-900">{successRate}%</span>
                          </div>
                        </div>
                        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${successRate}%` }}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setCurrentView('history')}
                    className="mt-6 w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-blue-500 hover:text-blue-600"
                  >
                    View Past Scans →
                  </button>
                </div>
              </motion.aside>
            </div>
          </div>
        </div>
      )}

      {/* --- 2. THE RESULTS VIEW --- */}
      {currentView === 'results' && result && (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, padding: '60px 20px'}}>
          <div style={{width: '100%', maxWidth: '800px'}} ref={resultRef}>
            
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '40px'}}>
              {/* Back Arrow specifically mapped next to the Results Title */}
              <div onClick={() => setCurrentView('dashboard')} style={{cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569', paddingRight: '15px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </div>
              <h1 style={{margin: 0, fontSize: '32px', fontWeight: '800', color: '#1e293b'}}>Analysis Results</h1>
              <button onClick={downloadPdf} className="btn-ghost" style={{marginLeft:'auto', fontSize:'14px'}}>
                🧾 Download PDF
              </button>
            </div>
            {/* allow changing label if we know the scanId and user is logged in */}
            {token && result.scanId && (
              <div style={{marginBottom: '20px'}}>
                <label style={{fontSize: '14px', fontWeight: '600', color: '#475569'}}>Label / Title</label>
                <div style={{display:'flex', gap:'8px', alignItems:'center', marginTop:'4px'}}>
                  <input
                    type="text"
                    value={result.label || ''}
                    onChange={e => setResult({...result, label: e.target.value})}
                    style={{flex:1,padding:'8px',borderRadius:'6px',border:'1px solid #cbd5e1'}}
                  />
                  <button
                    onClick={async () => {
                      try {
                        const res = await axios.put(`http://localhost:5000/api/scans/${result.scanId}`, { label: result.label }, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        setResult(res.data);
                        fetchScans();
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="btn-ghost"
                    style={{fontSize:'12px'}}
                  >Save</button>
                </div>
              </div>
            )}
            
            {result.error ? (
              <div className="glass-card" style={{textAlign: 'center', padding: '40px'}}>
                <div style={{fontSize: '48px', marginBottom: '20px'}}>❌</div>
                <h2 style={{margin: '0 0 10px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b'}}>Analysis Failed</h2>
                <p style={{color: '#64748b', fontSize: '16px'}}>{result.error}</p>
              </div>
            ) : (
              <div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px'}}>
                  <div className="glass-card" style={{textAlign: 'center', padding: '40px'}}>
                    <div style={{fontSize: '48px', marginBottom: '20px'}}>📊</div>
                    <h2 style={{margin: '0 0 10px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b'}}>Match Score</h2>
                    <div style={{fontSize: '48px', fontWeight: '800', color: '#6366f1'}}>{result.match_score}/100</div>
                  </div>
                  
                  <div className="glass-card" style={{padding: '40px'}}>
                    <div style={{fontSize: '48px', marginBottom: '20px'}}>🔍</div>
                    <h2 style={{margin: '0 0 20px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b'}}>Skill Scan</h2>
                    <div style={{color: '#334155', fontSize: '16px', lineHeight: '1.6'}}>{result.skill_scan}</div>
                  </div>
                </div>
                
                <div className="glass-card" style={{padding: '40px'}}>
                  <h2 style={{margin: '0 0 20px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b'}}>Improvement Tips</h2>
                  <div style={{color: '#334155', fontSize: '16px', lineHeight: '1.6', whiteSpace: 'pre-wrap'}}>{result.tips}</div>
                </div>

                {/* cover letter area */}
                {token && result.resume_text && result.jd && (
                  <div className="glass-card" style={{padding: '40px', marginTop: '30px'}}>
                    <button onClick={generateCover} className="btn-generate" disabled={coverLoading}>
                      {coverLoading ? 'Generating...' : '📄 Generate Cover Letter'}
                    </button>
                    {cover && (
                      <div style={{marginTop: '20px'}}>
                        <textarea
                          value={cover}
                          onChange={e => setCover(e.target.value)}
                          style={{width:'100%',height:'200px',padding:'12px',borderRadius:'8px',border:'1px solid #cbd5e1',boxSizing:'border-box'}}
                        />
                        <div style={{textAlign:'right', marginTop:'10px'}}>
                          <button
                            onClick={() => navigator.clipboard.writeText(cover)}
                            className="btn-ghost"
                          >Copy to Clipboard</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- HISTORY VIEW --- */}
      {currentView === 'history' && (
        <div style={{padding: '40px 20px'}}>
          <h2 style={{fontSize: '28px', fontWeight: '700', marginBottom: '30px'}}>My Scan History</h2>
          {scans.length === 0 ? (
            <p style={{color: '#64748b'}}>No scans yet. Upload a resume to get started.</p>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '20px'}}>
              {scans.map(scan => (
                <div key={scan.id} className="glass-card" style={{padding: '20px', position: 'relative'}}>
                  <div style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px'}}>{scan.label || 'Untitled'}</div>
                  <div style={{fontSize: '48px', fontWeight: '800', color: '#6366f1'}}>{scan.result.match_score}/100</div>
                  <div style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>{new Date(scan.created_at).toLocaleString()}</div>
                  <div style={{position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px'}}>
                    <button
                      style={{fontSize: '12px'}}
                      onClick={() => {
                        setResult({ ...scan.result, scanId: scan.id, label: scan.label });
                        setCurrentView('results');
                      }}
                    >View</button>
                    <button
                      style={{fontSize: '12px', color: 'red'}}
                      onClick={async () => {
                        if (window.confirm('Delete this scan?')) {
                          try {
                            await axios.delete(`http://localhost:5000/api/scans/${scan.id}`, {
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            fetchScans();
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                    >Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- 3. THE LOGIN VIEW --- */}
      {currentView === 'login' && (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '60px 20px'}}>
          <div className="glass-card" style={{width: '100%', maxWidth: '420px', flex: 'none', padding: '40px'}}>
            <h2 style={{margin: '0 0 30px 0', fontSize: '24px', fontWeight: '700', textAlign: 'center', color: '#1e293b'}}>Welcome back.</h2>
            <form onSubmit={handleAuth} style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569'}}>Email *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '15px', outline: 'none', boxSizing: 'border-box'}} />
              </div>
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569'}}>Password *</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '15px', outline: 'none', boxSizing: 'border-box'}} />
              </div>
              <div style={{textAlign: 'left', marginBottom: '20px'}}><span style={{color: '#2563eb', fontWeight: '600', cursor: 'pointer', fontSize: '14px'}}>Forgot password?</span></div>
              <button type="submit" className="btn-generate">Log in</button>
            </form>
            <p style={{marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#64748b'}}>Don't have an account? <span style={{color: '#2563eb', fontWeight: '600', cursor: 'pointer'}} onClick={() => setCurrentView('signup')}>Sign up</span></p>
          </div>
        </div>
      )}

      {/* --- 4. THE SIGNUP VIEW --- */}
      {currentView === 'signup' && (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '60px 20px'}}>
          <div className="glass-card" style={{width: '100%', maxWidth: '420px', flex: 'none', padding: '40px'}}>
            <h2 style={{margin: '0 0 30px 0', fontSize: '24px', fontWeight: '700', textAlign: 'center', color: '#1e293b'}}>Sign up for Caliper</h2>
            <form onSubmit={handleAuth} style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569'}}>Email *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '15px', outline: 'none', boxSizing: 'border-box'}} />
              </div>
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569'}}>Password *</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '15px', outline: 'none', boxSizing: 'border-box'}} />
                <p style={{margin: '6px 0 0 0', fontSize: '12px', color: '#94a3b8'}}>8 or more characters</p>
              </div>
              <button type="submit" className="btn-generate">Create account</button>
            </form>
            <p style={{marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#64748b'}}>Already have an account? <span style={{color: '#2563eb', fontWeight: '600', cursor: 'pointer'}} onClick={() => setCurrentView('login')}>Log in</span></p>
          </div>
        </div>
      )}

      {/* --- MEGA DARK FOOTER --- */}
      {currentView !== 'home' && (
      <footer className="mega-footer">
        <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '40px', marginBottom: '30px', flexWrap: 'wrap', gap: '40px'}}>
          <div style={{maxWidth: '300px'}}>
            <h2 style={{margin: '0', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px', color: '#ffffff'}}>Caliper</h2>
            <p style={{marginTop: '15px', fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1'}}>Helping professionals optimize their job applications and land their dream careers since 2026.</p>
          </div>
          
          <div style={{display: 'flex', gap: '80px', flexWrap: 'wrap'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <h4 style={{color: '#6366f1', fontSize: '16px', fontWeight: '600', margin: '0 0 10px 0'}}>Services</h4>
              <span className="footer-link">CV Scoring (ATS)</span>
              <span className="footer-link">Job Matching Score</span>
              <span className="footer-link">Cover Letter Generator</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <h4 style={{color: '#6366f1', fontSize: '16px', fontWeight: '600', margin: '0 0 10px 0'}}>Resources</h4>
              <span className="footer-link">About Us</span>
              <span className="footer-link">Contact Us</span>
              <span className="footer-link">Pricing</span>
            </div>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px', alignItems: 'center'}}>
          <div style={{display: 'flex', gap: '20px'}}>
            <span>© 2026 Caliper. All rights reserved.</span>
          </div>
          <div style={{display: 'flex', cursor: 'pointer'}}>
            <span className="footer-link">Privacy Policy</span>
            <span className="footer-link" style={{marginLeft: '15px'}}>Terms of Service</span>
          </div>
        </div>
        <div style={{textAlign: 'center', marginTop: '30px', fontSize: '13px', color: '#64748b'}}>
          Made by Yashwanth Gowda
        </div>
      </footer>
      )}

    </div>
  );
};

export default App;