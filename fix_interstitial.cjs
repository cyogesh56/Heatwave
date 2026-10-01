const fs = require('fs');
let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

// Update handleNextCard signature
hv = hv.replace(
  "  const handleNextCard = () => {",
  "  const handleNextCard = (forceInterstitial = false) => {"
);

// Update action listener for override to pass true
hv = hv.replace(
  "setTimeout(() => { setUiAlert(''); handleNextCard(); }, 2500);\n         } else if (action.power === 'deflect') {",
  "setTimeout(() => { setUiAlert(''); handleNextCard(true); }, 2500);\n         } else if (action.power === 'deflect') {"
);

// Update the interstitial logic condition to trigger on game start or force
hv = hv.replace(
  "      if (prevType && prevType !== drawn.card.type) {",
  "      if (!prevType || prevType !== drawn.card.type || forceInterstitial) {"
);

// Make sure other handleNextCard calls are unmodified or handled safely (they are just onClick={handleNextCard} which passes an event, but JS boolean coercion might treat the event as true! We should wrap them to () => handleNextCard() if they are onClick)
hv = hv.replace(
  /onClick=\{handleNextCard\}/g,
  "onClick={() => handleNextCard(false)}"
);

fs.writeFileSync('src/views/HostView.tsx', hv);
console.log('HostView updated');
