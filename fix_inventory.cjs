const fs = require('fs');
let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

// Insert useRef for state tracking right after useSyncTimer
hv = hv.replace(
  "  const timeLeft = useSyncTimer(hostGameState?.timers?.endsAt);",
  "  const timeLeft = useSyncTimer(hostGameState?.timers?.endsAt);\n  const hostGameStateRef = React.useRef(hostGameState);\n  React.useEffect(() => { hostGameStateRef.current = hostGameState; }, [hostGameState]);"
);

// Replace hostGameState inside handleNextCard with hostGameStateRef.current
// But only inside handleNextCard
const oldHandleNextCard = hv.match(/const handleNextCard = \(forceInterstitial = false, skipInterstitial = false\) => \{[\s\S]*?\};\n\n  if \(!hostGameState\?\.currentCard\) \{/)[0];
let newHandleNextCard = oldHandleNextCard.replace(
  "  const handleNextCard = (forceInterstitial = false, skipInterstitial = false) => {",
  "  const handleNextCard = (forceInterstitial = false, skipInterstitial = false) => {\n    const currentState = hostGameStateRef.current;"
);
newHandleNextCard = newHandleNextCard.replace(/hostGameState\!?\.players/g, "currentState!.players");
newHandleNextCard = newHandleNextCard.replace(/hostGameState/g, "currentState");
newHandleNextCard = newHandleNextCard.replace(/currentStateRef/g, "hostGameStateRef"); // undo the renaming of the ref if it happened

hv = hv.replace(oldHandleNextCard, newHandleNextCard);

fs.writeFileSync('src/views/HostView.tsx', hv);
console.log('HostView inventory fixed');
