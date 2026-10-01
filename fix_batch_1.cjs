const fs = require('fs');

function replaceInFile(filepath, replacements) {
    let content = fs.readFileSync(filepath, 'utf8');
    for (const [regex, replacement] of replacements) {
        content = content.replace(regex, replacement);
    }
    fs.writeFileSync(filepath, content);
}

// 1. ControllerView subtext
replaceInFile('src/views/ControllerView.tsx', [
    [/Look at the big screen\./g, 'Look at the big screen. Wait for the Host to start.']
]);

// 2. LobbyView player pill animation (remove animate-bounce)
replaceInFile('src/views/LobbyView.tsx', [
    [/animate-bounce/g, '']
]);

// 3. Game start minimum 2 players
replaceInFile('src/views/LobbyView.tsx', [
    [/disabled=\{selectedDecks\.length === 0 \|\| connectedPlayers\.length < 1\}/g, 'disabled={selectedDecks.length === 0 || connectedPlayers.length < 2}']
]);

// 4. LobbyView Deck Selector Scrollbar
replaceInFile('src/views/LobbyView.tsx', [
    [/<div className="flex flex-col gap-3 max-h-\[50vh\] overflow-y-auto pr-2">/g, '<div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto px-4 -mx-4 pb-4">']
]);

// 12. "Waiting..." stuck on player screen
// We need a useEffect to reset selectedChoice when the card changes.
let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');
if (!cv.includes('useEffect(() => { setSelectedChoice(null);')) {
    cv = cv.replace(/const { card, parsedPrompt } = clientState\.currentCard;/, `
  const { card, parsedPrompt } = clientState.currentCard;
  
  React.useEffect(() => {
    setSelectedChoice(null);
  }, [card.id]);
`);
    fs.writeFileSync('src/views/ControllerView.tsx', cv);
}

console.log("Batch 1 applied.");
