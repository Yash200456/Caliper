import React, { useState } from 'react';

const AIInterviewer = ({ bulletPoint, onComplete, onCancel }) => {
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [improvedBullet, setImprovedBullet] = useState(null);
  const [error, setError] = useState(null);

  const startInterview = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/interview/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          resume_text: '',
          bullet_point: bulletPoint
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to start interview');
      }
      
      const data = await response.json();
      setSessionId(data.session_id);
      setCurrentQuestion(data.first_question);
      setConversation([{ type: 'ai', text: data.first_question }]);
    } catch (err) {
      console.error(err);
      setError('Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    
    const currentAnswer = userAnswer;
    setConversation(prev => [...prev, { type: 'user', text: currentAnswer }]);
    setUserAnswer('');
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/interview/continue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          session_id: sessionId,
          answer: currentAnswer
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }
      
      const data = await response.json();
      
      if (data.is_complete) {
        setImprovedBullet(data.improved_bullet);
        if (onComplete) {
          onComplete(data.improved_bullet);
        }
      } else {
        setCurrentQuestion(data.next_question);
        setConversation(prev => [...prev, { type: 'ai', text: data.next_question }]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    }
  };

  // Initial state - before interview starts
  if (!sessionId) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-500 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-block bg-blue-100 rounded-full p-4 mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">💬 AI Career Coach</h3>
          <p className="text-gray-600">
            Let's transform this weak bullet point into a powerful STAR achievement through conversation.
          </p>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="text-sm font-semibold text-red-800 mb-1">Current Bullet (Weak):</p>
          <p className="text-sm font-mono text-red-700">"{bulletPoint}"</p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-sm font-semibold text-blue-800 mb-2">What we'll do:</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>✓ Extract specific results and metrics</li>
            <li>✓ Add quantifiable achievements</li>
            <li>✓ Use strong action verbs</li>
            <li>✓ Follow STAR methodology</li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={startInterview}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Starting Interview...' : 'Start AI Interview →'}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  // Interview complete state
  if (improvedBullet) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-green-500 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">✅ Interview Complete!</h3>
          <p className="text-gray-600">Your bullet point has been transformed</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Before:</p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm font-mono text-red-800">{bulletPoint}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-2">After:</p>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-sm font-mono text-green-800">{improvedBullet}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(improvedBullet);
              alert('Copied to clipboard!');
            }}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            📋 Copy Improved Bullet
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  // Interview in progress
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">💬 AI Career Coach</h3>
        <span className="text-sm text-gray-500">{conversation.length} messages</span>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Conversation */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
        {conversation.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg shadow-sm ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              {msg.type === 'ai' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs">🤖</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">AI Coach</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 p-4 rounded-lg rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input */}
      <div className="flex gap-3">
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your answer... (Press Enter to send, Shift+Enter for new line)"
          className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none resize-none"
          rows="2"
          disabled={loading}
        />
        <button
          onClick={submitAnswer}
          disabled={loading || !userAnswer.trim()}
          className="bg-blue-600 text-white px-8 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all self-end"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mt-2 text-center">
        Press Enter to send • Shift+Enter for new line
      </p>
    </div>
  );
};

export default AIInterviewer;