const fs = require('fs');
let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

// Inside handleAction
// We need to inject an early return if action.type === 'power' and inventory is invalid or uiState === 'interstitial'
hv = hv.replace(
  "} else if (action.type === 'power') {",
  "} else if (action.type === 'power') {\n         if (hostGameState?.uiState === 'interstitial') return;\n         const inv = hostGameState?.players[playerId]?.inventory;\n         const powerKey = action.power.startsWith('override') ? 'override' : action.power;\n         if (!inv || inv[powerKey] <= 0) return;"
);

// We also need to reject votes if uiState !== 'voting'
hv = hv.replace(
  "if (action.type === 'join') {",
  "if (action.type === 'vote' && hostGameState?.uiState !== 'voting') return;\n         if (action.type === 'join') {"
);

fs.writeFileSync('src/views/HostView.tsx', hv);
console.log('Authority patched');
