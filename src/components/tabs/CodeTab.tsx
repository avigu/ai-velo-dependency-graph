import React, { useState, useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import css from 'highlight.js/lib/languages/css';
import { Extension, CodeFile } from '../../types';
import { Copy, Check, FileCode } from 'lucide-react';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('css', css);

interface CodeTabProps {
  extension: Extension;
}

export default function CodeTab({ extension }: CodeTabProps) {
  const [selectedFile, setSelectedFile] = useState(extension.codeFiles[0]);

  // Reset when extension changes
  useEffect(() => {
    setSelectedFile(extension.codeFiles[0]);
  }, [extension.id]);

  return (
    <div className="flex flex-col sm:flex-row h-full" style={{ minHeight: 0 }}>
      {/* Mobile: select dropdown */}
      {extension.codeFiles.length > 1 && (
        <div className="sm:hidden px-3 py-2 border-b shrink-0" style={{ background: '#252526', borderColor: '#3e3e42' }}>
          <select
            value={selectedFile.name}
            onChange={e => {
              const f = extension.codeFiles.find(f => f.name === e.target.value);
              if (f) setSelectedFile(f);
            }}
            className="w-full px-2 py-1.5 rounded text-xs border focus:outline-none"
            style={{ background: '#1e1e1e', color: '#cccccc', borderColor: '#3e3e42' }}
          >
            {extension.codeFiles.map(file => (
              <option key={file.name} value={file.name}>{file.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Desktop: file tree sidebar */}
      {extension.codeFiles.length > 1 && (
        <div
          className="hidden sm:flex w-48 border-r flex-col overflow-y-auto shrink-0"
          style={{ background: '#252526', borderColor: '#3e3e42' }}
        >
          <p className="px-3 py-2 text-[10px] uppercase tracking-widest" style={{ color: '#858585' }}>
            Files
          </p>
          {extension.codeFiles.map(file => (
            <button
              key={file.name}
              onClick={() => setSelectedFile(file)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors"
              style={{
                background: selectedFile.name === file.name ? '#094771' : 'transparent',
                color: selectedFile.name === file.name ? '#fff' : '#cccccc',
              }}
              onMouseEnter={e => {
                if (selectedFile.name !== file.name)
                  (e.currentTarget as HTMLElement).style.background = '#2a2d2e';
              }}
              onMouseLeave={e => {
                if (selectedFile.name !== file.name)
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <FileCode size={12} style={{ opacity: 0.7 }} />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Code viewer */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <CodeViewer file={selectedFile} />
      </div>
    </div>
  );
}

function CodeViewer({ file }: { file: CodeFile }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute('data-highlighted');
      hljs.highlightElement(codeRef.current);
    }
  }, [file]);

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const lines = file.content.split('\n');

  return (
    <>
      {/* File header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b shrink-0"
        style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
      >
        <div className="flex items-center gap-2">
          <FileCode size={13} style={{ color: '#858585' }} />
          <span className="text-xs font-mono" style={{ color: '#cccccc' }}>
            {file.name}
          </span>
          <span
            className="px-1.5 py-0.5 rounded text-[10px] uppercase"
            style={{ background: '#3c3c3c', color: '#858585' }}
          >
            {file.language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors"
          style={{
            background: copied ? 'rgba(74,222,128,0.15)' : '#3c3c3c',
            color: copied ? '#4ade80' : '#858585',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code with line numbers */}
      <div className="flex-1 overflow-auto" style={{ background: '#1e1e1e' }}>
        <div className="flex min-w-max">
          {/* Line numbers */}
          <div
            className="select-none text-right px-4 py-4 text-xs font-mono"
            style={{ color: '#404040', lineHeight: '1.6', userSelect: 'none', minWidth: 48, background: '#1e1e1e' }}
          >
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code */}
          <div className="flex-1 py-4 pr-8 overflow-hidden">
            <pre className="text-xs font-mono m-0" style={{ lineHeight: 1.6 }}>
              <code
                ref={codeRef}
                className={`language-${file.language}`}
                style={{ background: 'transparent', padding: 0 }}
              >
                {file.content}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
