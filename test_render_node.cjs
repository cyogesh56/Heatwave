const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="root"></div></body></html>`, { url: "http://localhost/", pretendToBeVisual: true });
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

require('ts-node').register({ compilerOptions: { module: 'commonjs', jsx: 'react-jsx', esModuleInterop: true } });
const React = require('react');
const { render } = require('react-dom'); // old react 17 style just for testing

const GameContext = require('./src/context/GameContext');
GameContext.useGame = () => ({
  hostServer: { roomCode: 'ABCD', broadcast: () => {} },
  hostGameState: {
    players: { 'p1': { name: 'P1', isConnected: true, inventory: { deflect: 0, killswitch: 0, override: 0 } } },
    uiState: 'voting',
    currentCard: { card: { id: 'c1', type: 'truth', prompt: 'Hello', phase: 1, options: ['A','B','C','D'] }, parsedPrompt: 'Hello' }
  },
  setHostGameState: () => {}, gameEngine: {}, clientNode: null
});

jest = { mock: () => {} };
const framerMotion = require('framer-motion');
framerMotion.motion = { div: 'div' };
framerMotion.AnimatePresence = ({ children }) => children;

const { HostView } = require('./src/views/HostView');

try {
  render(React.createElement(HostView), document.getElementById('root'));
  console.log("RENDERED_HTML:", document.getElementById('root').innerHTML.substring(0, 500));
} catch (e) {
  console.error("CRASH:", e);
}
