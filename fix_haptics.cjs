const fs = require('fs');
let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

// When AlertOverlay shows, we want to vibrate.
// AlertOverlay is in ControllerView.
// We can use a useEffect on personalAlert or globalAlert.

code = code.replace(
  /const globalAlert = state\.uiAlert;\n  const personalAlert = state\.players\?\.\[node\.playerId\]\?\.uiAlert;/,
  `const globalAlert = state.uiAlert;\n  const personalAlert = state.players?.[node.playerId]?.uiAlert;\n\n  React.useEffect(() => {\n    if (personalAlert || globalAlert) {\n      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);\n    }\n  }, [personalAlert, globalAlert]);`
);

// We can also vibrate when a new card is shown or phase changes. 
// A simple way is to vibrate on interstitial change.
code = code.replace(
  /if \(clientState\.uiState === 'interstitial' && clientState\.interstitial\) \{/,
  `React.useEffect(() => {
    if (clientState?.uiState === 'interstitial') {
      if (navigator.vibrate) navigator.vibrate(100);
    }
  }, [clientState?.uiState]);\n\n  if (clientState.uiState === 'interstitial' && clientState.interstitial) {`
);

fs.writeFileSync('src/views/ControllerView.tsx', code);
