const React = require('react');
const ReactDOMServer = require('react-dom/server');
require('ts-node').register({ compilerOptions: { module: 'commonjs', jsx: 'react-jsx', esModuleInterop: true } });

const GameContext = require('./src/context/GameContext');
GameContext.useGame = () => ({
  hostServer: { roomCode: 'ABCD', broadcast: () => {} },
  hostGameState: {
    players: { 'player1': { name: 'Player 1', isConnected: true, inventory: { deflect: 0, killswitch: 0, override: 0 } } },
    uiState: 'voting',
    currentCard: { card: { id: 'c1', type: 'truth', prompt: 'Hello', phase: 1, options: ['A','B','C','D'] }, parsedPrompt: 'Hello' }
  },
  setHostGameState: () => {}, gameEngine: {}, clientNode: null
});

const { HostView } = require('./src/views/HostView');

// Mock framer-motion since it sometimes fails in Node
jest = { mock: () => {} };
const framerMotion = require('framer-motion');
framerMotion.motion = { div: 'div' };
framerMotion.AnimatePresence = ({ children }) => children;

try {
  console.log("Rendering...");
  const html = ReactDOMServer.renderToString(React.createElement(HostView));
  console.log("HTML length:", html.length);
} catch (e) {
  console.error("RUNTIME ERROR:", e);
}
