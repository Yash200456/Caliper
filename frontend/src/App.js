import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // Restored default view

  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUpload = async () => {
    if (!file || !jd) return alert("Please provide both a Resume and a Job Description!");
    setLoading(true);
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jd', jd);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', formData);
      setResult(response.data.analysis);
    } catch (err) {
      console.error(err);
      alert("Backend error: Ensure Node.js is running on port 5000.");
    }
    setLoading(false);
  };

  const handleAuth = (e) => {
    e.preventDefault();
    alert(`Simulating ${currentView} for: ${email}`);
    setCurrentView('dashboard'); 
  };

  return (
    <div className="page-container">
      
      {/* --- The Navbar --- */}
      <nav className="navbar">
        <div onClick={() => setCurrentView('dashboard')} style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px'}}>
          <h1 style={{margin: 0, fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px'}}>
            CareerOrbit <span style={{color: '#6366f1'}}>AI</span>
          </h1>
          <div style={{background: '#eff6ff', color: '#3b82f6', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'}}>Reva ISE Edition</div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <button className="btn-ghost" onClick={() => setCurrentView('login')}>Log In</button>
          <button className="btn-pill" onClick={() => setCurrentView('signup')}>Sign Up</button>
        </div>
      </nav>

      {/* --- CONDITIONAL RENDERING --- */}
      
      {/* 1. THE DASHBOARD VIEW */}
      {currentView === 'dashboard' && (
        <div style={{display: 'flex', gap: '30px', padding: '40px 50px', flex: 1}}>
          
          {/* Left Column */}
          <div className="glass-card">
            <div style={{marginBottom: '35px', textAlign: 'center'}}>
              <h2 style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#1e293b'}}>Select Resume for Analysis</h2>
              <p style={{margin: '8px 0 0 0', fontSize: '15px', color: '#64748b'}}>Choose a sample resume below and define the target role.</p>
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
                {loading ? "✨ Analyzing Data..." : "Scan your Resume"}
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="glass-card">
            {result ? (
              <>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px'}}>
                  <div>
                    <h2 style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#1e293b'}}>📊 Analysis Complete</h2>
                    <p style={{margin: '8px 0 0 0', fontSize: '15px', color: '#64748b'}}>Here is your personalized roadmap</p>
                  </div>
                  <button style={{background: 'transparent', color: '#2563eb', border: '1px solid #2563eb', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px'}}>Download PDF</button>
                </div>
                <div style={{color: '#334155', fontSize: '15px', lineHeight: '1.8', whiteSpace: 'pre-wrap', overflowY: 'auto', paddingRight: '10px'}}>{result}</div>
              </>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 40px'}}>
                <div style={{fontSize: '48px', color: '#cbd5e1', marginBottom: '20px', background: '#f8fafc', padding: '20px', borderRadius: '20px'}}>📄</div>
                <h3 style={{fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 10px 0'}}>Ready to see the magic?</h3>
                <p style={{color: '#64748b', fontSize: '15px', lineHeight: '1.6'}}>Select a sample resume and target JD to see our AI-powered analysis in action.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. THE LOGIN VIEW */}
      {currentView === 'login' && (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '60px 20px'}}>
          
          <div style={{width: '100%', maxWidth: '420px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
            <h1 onClick={() => setCurrentView('dashboard')} style={{margin: 0, fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', color: '#0f172a', cursor: 'pointer'}}>
              CareerOrbit <span style={{color: '#6366f1'}}>AI</span>
            </h1>
            <button onClick={() => setCurrentView('dashboard')} className="btn-icon" title="Back to Home">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8l-4 4 4 4M16 12H8"/>
              </svg>
            </button>
          </div>
          
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

      {/* 3. THE SIGNUP VIEW */}
      {currentView === 'signup' && (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '60px 20px'}}>
          
          <div style={{width: '100%', maxWidth: '420px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
            <h1 onClick={() => setCurrentView('dashboard')} style={{margin: 0, fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', color: '#0f172a', cursor: 'pointer'}}>
              CareerOrbit <span style={{color: '#6366f1'}}>AI</span>
            </h1>
            <button onClick={() => setCurrentView('dashboard')} className="btn-icon" title="Back to Home">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8l-4 4 4 4M16 12H8"/>
              </svg>
            </button>
          </div>
          
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

      {/* --- MEGA DARK FOOTER --- */}
      <footer className="mega-footer">
        <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '40px', marginBottom: '30px', flexWrap: 'wrap', gap: '40px'}}>
          <div style={{maxWidth: '300px'}}>
            <h2 style={{margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px', color: '#ffffff'}}>CareerOrbit <span style={{color: '#a855f7'}}>AI</span></h2>
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