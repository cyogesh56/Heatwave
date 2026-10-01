const fs = require('fs');

const appCode = `import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './views/Landing';
import LobbyView from './views/LobbyView';
import { HostView } from './views/HostView';
import { ControllerView } from './views/ControllerView';
import { GameProvider } from './context/GameContext';
import { ThemeToggle } from './components/ui/ThemeToggle';

const ThemeToggleWrapper = () => {
  const loc = useLocation();
  if (loc.pathname === '/play') return null;
  return <ThemeToggle />;
};

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <ThemeToggleWrapper />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/lobby" element={<LobbyView />} />
          <Route path="/host" element={<HostView />} />
          <Route path="/play" element={<ControllerView />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
`;

fs.writeFileSync('src/App.tsx', appCode);
console.log('App updated');
