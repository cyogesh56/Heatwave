const fs = require('fs');

let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

// Remove the bad hook
cv = cv.replace(/  React\.useEffect\(\(\) => \{\n    setSelectedChoice\(null\);\n  \}, \[card\.id\]\);\n/, '');

// Add the safe hook above the early returns
const safeHook = `  React.useEffect(() => {
    setSelectedChoice(null);
  }, [clientState?.currentCard?.card?.id]);\n\n`;

cv = cv.replace(/  const timeLeft = useSyncTimer\(clientState\?\.timers\?\.endsAt\);\n/, `  const timeLeft = useSyncTimer(clientState?.timers?.endsAt);\n\n` + safeHook);

fs.writeFileSync('src/views/ControllerView.tsx', cv);
console.log('Fixed React hook crash');
