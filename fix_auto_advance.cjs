const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

const oldLogic = `  useEffect(() => {
    const activeCount = Object.values(hostGameState?.players || {}).filter((p: any) => p.isConnected !== false).length;
    let requiredVotes = activeCount;
    
    if (hostGameState?.currentCard?.assignedResponderName) {
      const responder = Object.entries(hostGameState.players || {}).find(([id, p]: [string, any]) => p.name === hostGameState.currentCard?.assignedResponderName);
      if (responder && responder[1].isConnected !== false) {
        requiredVotes = 1;
      }
    }`;

const newLogic = `  useEffect(() => {
    const activeCount = Object.values(hostGameState?.players || {}).filter((p: any) => p.isConnected !== false).length;
    let requiredVotes = activeCount;
    
    const cardType = hostGameState?.currentCard?.card.type;
    
    if (hostGameState?.currentCard?.assignedResponderName) {
        // The assigned responder guesses out loud, everyone else votes.
        requiredVotes = Math.max(1, activeCount - 1);
    } else if (cardType === 'dare' || cardType === 'truth') {
        // Physical activities / open discussions only require 1 person (the target) to click "Done"
        requiredVotes = 1;
    }`;

code = code.replace(oldLogic, newLogic);

fs.writeFileSync('src/views/HostView.tsx', code);
