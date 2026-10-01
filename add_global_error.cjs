const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf-8');
const boundary = `
import React from 'react';
class GlobalErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '20px', background: 'white', zIndex: 99999, position: 'relative', height: '100vh', width: '100vw' }}>
          <h2>App crashed.</h2>
          <pre style={{whiteSpace: 'pre-wrap'}}>{this.state.error && this.state.error.toString()}</pre>
          <pre style={{whiteSpace: 'pre-wrap'}}>{this.state.error && this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
`;

if (!code.includes('GlobalErrorBoundary')) {
    code = code.replace("import { Route, Routes } from 'react-router-dom';", "import { Route, Routes } from 'react-router-dom';\n" + boundary);
    code = code.replace("<GameProvider>", "<GlobalErrorBoundary>\n      <GameProvider>");
    code = code.replace("</GameProvider>", "</GameProvider>\n      </GlobalErrorBoundary>");
    fs.writeFileSync('src/App.tsx', code);
}
