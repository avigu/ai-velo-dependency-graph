import React from 'react';
import ReactDOM from 'react-dom/client';
import 'highlight.js/styles/vs2015.css';
import './index.css';
import App from './App';
import SimpleView from './SimpleView';

const isSimple = window.location.pathname.startsWith('/simple');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isSimple ? <SimpleView /> : <App />}
  </React.StrictMode>,
);
