require('ignore-styles');
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    jsx: 'react-jsx',
    esModuleInterop: true,
  }
});
const React = require('react');
const { renderToString } = require('react-dom/server');

// Mock GameContext
const GameContext = require('./src/context/GameContext');
GameContext.useGame = () => ({
  hostServer: { roomCode: 'ABCD', broadcast: () => {} },
  hostGameState: {
    players: {
       'player1': { name: 'Player 1', isConnected: true, inventory: { deflect: 0, killswitch: 0, override: 0 } },
       'player2': { name: 'Player 2', isConnected: true, inventory: { deflect: 0, killswitch: 0, override: 0 } }
    },
    uiState: 'voting',
    currentCard: {
      card: { id: 'c1', type: 'truth', prompt: 'Hello', phase: 1 },
      parsedPrompt: 'Hello'
    }
  },
  setHostGameState: () => {},
  gameEngine: {},
  clientNode: null
});

const { HostView } = require('./src/views/HostView');

try {
  console.log("Rendering HostView...");
  renderToString(React.createElement(HostView));
  console.log("Render successful!");
} catch (e) {
  console.error("Render failed with error:");
  console.error(e);
}
