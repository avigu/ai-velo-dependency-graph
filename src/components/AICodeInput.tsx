import React, { useState, useRef, useEffect } from 'react';
import { aiAnalyzer } from '../utils/aiParser';

interface AICodeInputProps {
  onAnalysisComplete: (result: any) => void;
  initialCode?: string;
}

const AICodeInput: React.FC<AICodeInputProps> = ({ onAnalysisComplete, initialCode = '' }) => {
  const [code, setCode] = useState(initialCode);
  const [filename, setFilename] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [hasEnvApiKey, setHasEnvApiKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for environment API key on component mount
  useEffect(() => {
    const envApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (envApiKey && envApiKey.trim()) {
      setApiKey(envApiKey);
      setHasEnvApiKey(true);
      aiAnalyzer.setApiKey(envApiKey);
    }
  }, []);

  const handleCodeChange = (newCode: string, newFilename?: string) => {
    setCode(newCode);
    if (newFilename) {
      setFilename(newFilename);
    }
    setError('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFilename(file.name);
        handleCodeChange(content, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key or configure it in .env file');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Set the API key if not already set from environment
      if (!hasEnvApiKey) {
        aiAnalyzer.setApiKey(apiKey);
      }
      
      // Analyze the code
      const result = await aiAnalyzer.analyzeCode(code, filename);
      
      onAnalysisComplete(result);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🤖</span> AI-Powered Velo Code Analysis
        </h3>
        
        {/* API Key Status */}
        {hasEnvApiKey ? (
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#d4edda', borderRadius: '6px', border: '1px solid #c3e6cb' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px', color: '#155724' }}>
              ✅ OpenAI API Key Loaded from Environment
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fff3cd', borderRadius: '6px', border: '1px solid #ffeaa7' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#856404' }}>
              🔑 OpenAI API Key Required
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key (sk-...)"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'monospace',
              }}
            />
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            📁 Upload File
          </button>
          
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !code.trim() || !apiKey.trim()}
            style={{
              padding: '8px 16px',
              backgroundColor: isAnalyzing ? '#a0aec0' : '#38a169',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {isAnalyzing ? '🔄 Analyzing...' : '🤖 Analyze with AI'}
          </button>
          
          <button
            onClick={() => handleCodeChange('')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e53e3e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            🗑️ Clear
          </button>
        </div>

        {filename && (
          <div style={{ 
            fontSize: '12px', 
            color: '#4a5568', 
            backgroundColor: '#e6fffa', 
            padding: '6px 12px', 
            borderRadius: '4px',
            border: '1px solid #38b2ac',
            marginBottom: '8px'
          }}>
            📄 File: <strong>{filename}</strong>
          </div>
        )}

        {error && (
          <div style={{ 
            fontSize: '14px', 
            color: '#c53030', 
            backgroundColor: '#fed7d7', 
            padding: '8px 12px', 
            borderRadius: '4px',
            border: '1px solid #fc8181',
            marginBottom: '8px'
          }}>
            ❌ {error}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".js,.jsx,.ts,.tsx,.jsw"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      <textarea
        value={code}
        onChange={(e) => handleCodeChange(e.target.value, filename)}
        placeholder="Enter your Velo by Wix code here or upload a file..."
        style={{
          width: '100%',
          height: '300px',
          padding: '12px',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          fontSize: '13px',
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          resize: 'vertical',
          backgroundColor: 'white',
          lineHeight: '1.5',
        }}
      />
    </div>
  );
};

export default AICodeInput; 