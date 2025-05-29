import React, { useState } from 'react';
import './App.css';
import AICodeInput from './components/AICodeInput';
import AIDependencyGraph from './components/AIDependencyGraph';
import { AIParseResult } from './utils/aiParser';

function App() {
  const [aiResult, setAiResult] = useState<AIParseResult | null>(null);

  const handleAnalysisComplete = (result: AIParseResult) => {
    setAiResult(result);
  };

  return (
    <div className="App">
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '24px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
          🤖 AI-Powered Velo Dependency Graph Visualizer
        </h1>
      </header>

      <main style={{ padding: '0 20px', maxWidth: '2400px', margin: '0 auto' }}>
        <AICodeInput onAnalysisComplete={handleAnalysisComplete} />
        
        {aiResult && (
          <div style={{
            height: '900px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            backgroundColor: 'white',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <AIDependencyGraph aiResult={aiResult} />
          </div>
        )}

        {!aiResult && (
          <div style={{
            padding: '40px',
            backgroundColor: '#f7fafc',
            borderRadius: '12px',
            border: '2px dashed #cbd5e0',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🤖</div>
            <h3 style={{ margin: '0 0 12px 0', color: '#2d3748' }}>Ready for AI Analysis</h3>
            <p style={{ margin: 0, color: '#4a5568', lineHeight: '1.6' }}>
              Enter your OpenAI API key and Velo code above, then click "Analyze with AI" to see an intelligent dependency graph.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
