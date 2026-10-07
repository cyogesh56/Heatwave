with open('src/App.tsx', 'r') as f:
    c = f.read()

if 'class GlobalErrorBoundary' not in c:
    c = c.replace('import { BrowserRouter', 'import React from \'react\';\nimport { BrowserRouter')
    
    error_boundary = """
class GlobalErrorBoundary extends React.Component<any, any> { 
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; } 
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; } 
  render() { 
    if (this.state.hasError) { 
      return <div style={{padding:'40px', color:'red', background:'white', fontFamily:'monospace', position:'fixed', inset:0, zIndex:99999}}>GLOBAL CRASH: {this.state.error?.message}<br/><br/>{this.state.error?.stack}</div>; 
    } 
    return this.props.children; 
  } 
}
"""
    c = c.replace('function App() {', error_boundary + '\nfunction App() {')
    c = c.replace('return (\n    <GameProvider>', 'return (\n  <GlobalErrorBoundary>\n    <GameProvider>')
    c = c.replace('</GameProvider>\n  );', '</GameProvider>\n  </GlobalErrorBoundary>\n  );')

with open('src/App.tsx', 'w') as f:
    f.write(c)
