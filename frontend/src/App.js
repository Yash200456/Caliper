import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={styles.pageContainer}>
      {/* Top Navigation */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>
          CareerOrbit <span style={styles.logoHighlight}>AI</span>
        </h1>
        <div style={styles.badge}>Reva ISE Edition</div>
      </nav>

      {/* Main Dashboard Layout */}
      <div style={styles.dashboard}>
        
        {/* LEFT COLUMN: Inputs */}
        <div style={styles.glassCard}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Candidate Setup</h2>
            <p style={styles.cardSubtitle}>Upload credentials & target role</p>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>📄 Upload Resume (PDF)</label>
            <div style={styles.fileDropZone}>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => setFile(e.target.files[0])} 
                style={styles.fileInput} 
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>🎯 Target Job Description</label>
            <textarea 
              placeholder="Paste the technical requirements, skills, and role details here..." 
              value={jd} 
              onChange={(e) => setJd(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <button 
            onClick={handleUpload} 
            disabled={loading} 
            style={loading ? styles.btnDisabled : styles.btnPrimary}
          >
            {loading ? "✨ AI is Analyzing..." : "🚀 Generate Intelligence Report"}
          </button>
        </div>

        {/* RIGHT COLUMN: Output */}
        <div style={styles.glassCard}>
          {result ? (
            <>
              <div style={styles.resultHeader}>
                <div>
                  <h2 style={styles.cardTitle}>📊 Analysis Complete</h2>
                  <p style={styles.cardSubtitle}>Here is your personalized roadmap</p>
                </div>
                <button style={styles.btnSecondary} onClick={() => window.print()}>
                  Download PDF
                </button>
              </div>
              <div style={styles.resultContent}>
                {result}
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateIcon}>🤖</div>
              <h3 style={styles.emptyStateText}>Awaiting Input</h3>
              <p style={styles.emptyStateSubtext}>Upload a resume and JD to see the AI magic happen right here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// --- PREMIUM SILVER STYLES ---
const styles = {
  pageContainer: {
    minHeight: '100vh',
    /* Premium light blue background stays to make the silver pop */
    background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: '#0f172a', 
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 50px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  },
  logo: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    color: '#0f172a',
  },
  logoHighlight: {
    color: '#0284c7', // Keeps the brand blue
  },
  badge: {
    background: 'rgba(2, 132, 199, 0.1)',
    color: '#0284c7',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    border: '1px solid rgba(2, 132, 199, 0.2)',
  },
  dashboard: {
    display: 'flex',
    flexDirection: 'row',
    gap: '30px',
    padding: '40px 50px',
    flex: 1,
    height: '100%',
  },
  glassCard: {
    flex: 1,
    /* THE MAGIC: Frosted Light Silver Gradient instead of flat white */
    background: 'linear-gradient(145deg, rgba(248, 250, 252, 0.85) 0%, rgba(226, 232, 240, 0.85) 100%)', 
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '24px',
    border: '1px solid rgba(203, 213, 225, 0.6)', // Metallic silver border
    padding: '40px',
    boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.08)', // Soft, high-end shadow
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    marginBottom: '30px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
  },
  cardSubtitle: {
    margin: '8px 0 0 0',
    fontSize: '14px',
    color: '#475569',
  },
  inputGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
  },
  fileDropZone: {
    border: '2px dashed rgba(148, 163, 184, 0.5)', // Slate/silver dashed border
    borderRadius: '16px',
    padding: '20px',
    background: 'rgba(241, 245, 249, 0.5)', // Soft silver fill
    transition: 'border 0.3s ease',
  },
  fileInput: {
    width: '100%',
    color: '#0f172a',
  },
  textarea: {
    width: '100%',
    height: '220px',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #cbd5e1', // Sleek silver border
    background: '#f8fafc', // Very light silver/off-white (not harsh white)
    color: '#0f172a',
    fontSize: '15px',
    lineHeight: '1.5',
    outline: 'none',
    resize: 'none',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)', // Inner depth
  },
  btnPrimary: {
    width: '100%',
    padding: '18px',
    background: 'linear-gradient(90deg, #0284c7 0%, #0369a1 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: 'auto',
    boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.4)',
    transition: 'transform 0.2s ease, opacity 0.2s',
  },
  btnDisabled: {
    width: '100%',
    padding: '18px',
    background: '#cbd5e1', // Silver disabled state
    color: '#64748b',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '700',
    marginTop: 'auto',
    cursor: 'not-allowed',
  },
  btnSecondary: {
    background: 'transparent',
    color: '#0284c7',
    border: '1px solid rgba(2, 132, 199, 0.4)',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.2s',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    paddingBottom: '20px',
  },
  resultContent: {
    color: '#334155', 
    fontSize: '16px',
    lineHeight: '1.8',
    whiteSpace: 'pre-wrap',
    overflowY: 'auto',
    paddingRight: '10px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    opacity: 0.8,
  },
  emptyStateIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  emptyStateText: {
    fontSize: '20px',
    color: '#0f172a',
    margin: '0 0 10px 0',
  },
  emptyStateSubtext: {
    color: '#475569',
    textAlign: 'center',
    maxWidth: '300px',
  }
};

export default App;