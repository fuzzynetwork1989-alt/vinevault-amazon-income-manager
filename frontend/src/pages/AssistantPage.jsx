import React, { useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function AssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const suggestedPrompts = [
    "What's a good strategy for Vine reviews?",
    "How should I price my inventory items?",
    "What are the best platforms for reselling?",
    "How can I increase my affiliate earnings?",
    "What tax deductions can I claim?",
    "How do I find profitable products to resell?",
    "What's the best way to organize my inventory?",
    "How can I improve my product photography?"
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3002/api/ai/generate', {
        prompt: prompt
      });
      
      const newEntry = {
        prompt: prompt,
        response: res.data.text,
        timestamp: new Date().toLocaleString()
      };
      
      setHistory([newEntry, ...history.slice(0, 9)]); // Keep last 10 conversations
      setResponse(res.data.text);
      setPrompt('');
    } catch (error) {
      console.error('Error getting AI response:', error);
      setResponse('Sorry, I\'m having trouble connecting right now. Make sure Ollama is running with the Mistral model.');
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestedClick(suggestedPrompt) {
    setPrompt(suggestedPrompt);
  }

  return (
    <div className="page-content">
      <h2>🤖 AI Assistant</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
          Your personal AI assistant for Amazon income strategies. Ask me anything about Vine reviews, 
          inventory management, pricing strategies, or growing your online business!
        </p>
        
        <div style={{ marginBottom: '1rem' }}>
          <h4>Quick Questions:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {suggestedPrompts.map((suggestedPrompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedClick(suggestedPrompt)}
                style={{
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary-dark)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'var(--primary)';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'var(--primary-light)';
                  e.target.style.color = 'var(--primary-dark)';
                }}
              >
                {suggestedPrompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask me anything about your Amazon income streams..."
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--gray-200)',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            style={{
              backgroundColor: loading || !prompt.trim() ? 'var(--gray-400)' : 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              height: 'fit-content'
            }}
          >
            {loading ? '🤔 Thinking...' : '💬 Ask'}
          </button>
        </div>
      </form>

      {response && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Latest Response</h3>
          <div style={{ 
            backgroundColor: 'var(--primary-light)', 
            padding: '1rem', 
            borderRadius: '8px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }}>
            {response}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h3>Conversation History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.map((entry, index) => (
              <div key={index} className="card">
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>You:</strong> {entry.prompt}
                </div>
                <div style={{ 
                  backgroundColor: 'var(--primary-light)', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  <strong>Assistant:</strong> {entry.response}
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--gray-600)', 
                  marginTop: '0.5rem' 
                }}>
                  {entry.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: 'var(--warning)', 
        color: 'white',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <strong>💡 Tip:</strong> Make sure Ollama is running locally with the Mistral model for the AI assistant to work.
        <br />
        Run: <code style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>ollama pull mistral && ollama serve</code>
      </div>
    </div>
  );
}

export default AssistantPage;
