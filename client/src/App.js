import React, { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
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

  const resultRef = React.useRef(null);

  const downloadPdf = () => {
    if (resultRef.current) {
      html2pdf().from(resultRef.current).set({
        margin:       10,
        filename:     'careerorbit-report.pdf',
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

  return (
    <div className="page-container">
      
      {/* --- THE NAVBAR (Now with Global Back Arrow) --- */}
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
              CareerOrbit <span style={{color: '#6366f1'}}>AI</span>
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

      {/* --- 0. THE LANDING PAGE (homepage) --- */}
      {currentView === 'home' && (
        <Landing onScan={() => setCurrentView('dashboard')} />
      )}

      {/* --- 1. THE DASHBOARD VIEW --- */}
      {currentView === 'dashboard' && (
        <div style={{display: 'flex', gap: '30px', padding: '40px 50px', flex: 1}}>
          
          {/* Left Column */}
          <div className="glass-card">
            <div style={{marginBottom: '35px', textAlign: 'center'}}>
              <h2 style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#1e293b'}}>Select Resume for Analysis</h2>
              <p style={{margin: '8px 0 0 0', fontSize: '15px', color: '#64748b'}}>Choose a sample resume below and define the target role.</p>
              {!token && (
                <p style={{margin: '10px 0 0', color: '#dc2626', fontSize: '14px'}}>Log in to save your scans and access history.</p>
              )}
            </div>

            <div style={{marginBottom: '25px', paddingBottom: '25px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px'}}>
                <div style={{background: '#f1f5f9', color: '#64748b', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', fontWeight: '700'}}>1</div>
                <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b'}}>Upload Credentials</h3>
              </div>
              <div className="file-drop-zone">
                <div style={{fontSize: '24px', color: '#94a3b8', marginBottom: '10px', border: '1px solid #cbd5e1', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>↑</div>
                <h4 style={{margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600', color: '#0f172a'}}>Click to upload your own resume</h4>
                <p style={{margin: '0 0 15px 0', fontSize: '13px', color: '#64748b'}}>PDF or DOCX (max 5MB)</p>
                <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} style={{display: 'none'}} id="file-upload" />
                <label htmlFor="file-upload" className="file-input-label">Browse Files</label>
                {file && <p style={{marginTop: '10px', color: '#6366f1', fontWeight: '600'}}>{file.name}</p>}
              </div>
            </div>

            <div style={{marginBottom: '25px', paddingBottom: '25px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px'}}>
                <div style={{background: '#f1f5f9', color: '#64748b', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', fontWeight: '700'}}>2</div>
                <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b'}}>Define Target Role</h3>
              </div>
              <textarea 
                className="custom-textarea"
                placeholder="Paste the technical requirements, skills, and role details here..." 
                value={jd} onChange={(e) => setJd(e.target.value)} 
              />
            </div>

            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px'}}>
                <div style={{background: '#f1f5f9', color: '#64748b', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', fontWeight: '700'}}>3</div>
                <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b'}}>Initialize AI</h3>
              </div>
              <button onClick={handleUpload} disabled={loading} className={loading ? "btn-disabled" : "btn-generate"}>
                {loading ? "✨ Analyzing Data..." : "🚀 Scan your Resume"}
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="glass-card">
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 40px'}}>
              <div style={{fontSize: '48px', color: '#cbd5e1', marginBottom: '20px', background: '#f8fafc', padding: '20px', borderRadius: '20px'}}>📄</div>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 10px 0'}}>Ready to see the magic?</h3>
              <p style={{color: '#64748b', fontSize: '15px', lineHeight: '1.6'}}>Select a sample resume and target JD to see our AI-powered analysis in action.</p>
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
            <h2 style={{margin: '0 0 30px 0', fontSize: '24px', fontWeight: '700', textAlign: 'center', color: '#1e293b'}}>Sign up for CareerOrbit</h2>
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

      {/* --- 5. THE ABOUT SECTION (Only on Home) --- */}
      {currentView === 'home' && (
        <div style={{padding: '80px 50px', background: '#ffffff', borderTop: '1px solid #e2e8f0', marginTop: '40px'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: '700', margin: '0 0 20px 0', color: '#1e293b'}}>About CareerOrbit AI</h2>
            <p style={{fontSize: '1.1rem', lineHeight: '1.7', color: '#64748b', margin: '0 0 40px 0', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto'}}>
              CareerOrbit AI is revolutionizing the job search process by leveraging cutting-edge artificial intelligence to provide instant, accurate resume analysis. Our platform helps professionals understand their strengths, identify skill gaps, and optimize their resumes for better ATS compatibility and job matching scores.
            </p>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '60px'}}>
              <div style={{textAlign: 'left'}}>
                <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', margin: '0 0 15px 0'}}>Our Mission</h3>
                <p style={{color: '#64748b', lineHeight: '1.6', margin: 0}}>
                  To empower job seekers with AI-driven insights that bridge the gap between talent and opportunity, making career advancement accessible to everyone.
                </p>
              </div>
              <div style={{textAlign: 'left'}}>
                <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', margin: '0 0 15px 0'}}>How It Works</h3>
                <p style={{color: '#64748b', lineHeight: '1.6', margin: 0}}>
                  Upload your resume, paste the job description, and let our AI analyze compatibility, suggest improvements, and provide personalized recommendations.
                </p>
              </div>
              <div style={{textAlign: 'left'}}>
                <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', margin: '0 0 15px 0'}}>Why Choose Us</h3>
                <p style={{color: '#64748b', lineHeight: '1.6', margin: 0}}>
                  Fast, accurate, and user-friendly. Our AI is trained on thousands of successful resumes and job postings to deliver reliable insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MEGA DARK FOOTER --- */}
      <footer className="mega-footer">
        <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '40px', marginBottom: '30px', flexWrap: 'wrap', gap: '40px'}}>
          <div style={{maxWidth: '300px'}}>
            <h2 style={{margin: '0', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px', color: '#ffffff'}}>CareerOrbit <span style={{color: '#a855f7'}}>AI</span></h2>
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
            <span>© 2026 CareerOrbit AI. All rights reserved.</span>
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

    </div>
  );
};

export default App;