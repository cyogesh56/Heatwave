import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './views/Landing';
import LobbyView from './views/LobbyView';
import { HostView } from './views/HostView';
import { ControllerView } from './views/ControllerView';
import { GameProvider } from './context/GameContext';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { PortraitEnforcer } from './components/ui/PortraitEnforcer';

const ThemeToggleWrapper = () => {
  const loc = useLocation();
  if (loc.pathname === '/play') return null;
  return null;
};


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

function App() {
  return (
  <GlobalErrorBoundary>
    <GameProvider>
      <BrowserRouter>
        <ThemeToggleWrapper />
        <PortraitEnforcer />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/lobby" element={<LobbyView />} />
          <Route path="/host" element={<HostView />} />
          <Route path="/play" element={<ControllerView />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  </GlobalErrorBoundary>
  );
}

export default App;
