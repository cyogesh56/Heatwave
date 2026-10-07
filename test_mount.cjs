require('ignore-styles');
require('ts-node').register({ compilerOptions: { module: 'commonjs', jsx: 'react-jsx', esModuleInterop: true } });
const React = require('react');
const { renderToString } = require('react-dom/server');

const GameContext = require('./src/context/GameContext');
GameContext.useGame = () => ({
  hostServer: { roomCode: 'ABCD', broadcast: () => {} },
  hostGameState: {
    players: { 'player1': { name: 'Player 1', isConnected: true, inventory: { deflect: 0, killswitch: 0, override: 0 } } },
    uiState: 'voting',
    currentCard: { card: { id: 'c1', type: 'truth', prompt: 'Hello', phase: 1 }, parsedPrompt: 'Hello' }
  },
  setHostGameState: () => {}, gameEngine: {}, clientNode: null
});

const { HostView } = require('./src/views/HostView');

try {
  renderToString(React.createElement(HostView));
  console.log("SUCCESS");
} catch (e) {
  console.error("CRASH:", e);
}
