const fs = require('fs');

let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

// Find the bad useEffect
const badHook = `  React.useEffect(() => {
    if (clientState?.uiState === 'interstitial') {
      if (navigator.vibrate) navigator.vibrate(100);
    }
  }, [clientState?.uiState]);`;

// Remove it from its current place
cv = cv.replace(badHook + '\n\n', '');

// Insert it after the previous useEffect
const prevHook = `  React.useEffect(() => {
    setSelectedChoice(null);
  }, [clientState?.currentCard?.card?.id]);`;

cv = cv.replace(prevHook, prevHook + '\n\n' + badHook);

fs.writeFileSync('src/views/ControllerView.tsx', cv);
