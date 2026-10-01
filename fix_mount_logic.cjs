const fs = require('fs');
let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

const oldEffect = `  useEffect(() => {
    if (!gameEngine || !hostGameState) return;

    if (!hostGameState.currentCard) {
      const players = Object.values(hostGameState.players).map(p => p.name);
      const drawn = gameEngine.drawNextCard(players.length > 0 ? players : ['Player 1', 'Player 2']);
      if (drawn) {
        const nextState = {
          ...hostGameState,
          currentCard: drawn,
          uiState: 'voting' as const
        };
        setHostGameState(nextState);
        hostServer?.broadcast(nextState);
      }
    }
  }, [gameEngine, hostGameState, hostServer, setHostGameState]);`;

const newEffect = `  useEffect(() => {
    if (!gameEngine || !hostGameState) return;

    if (!hostGameState.currentCard) {
      handleNextCard();
    }
  }, [gameEngine]); // Only run when gameEngine initializes`;

hv = hv.replace(oldEffect, newEffect);
fs.writeFileSync('src/views/HostView.tsx', hv);

console.log('Fixed mount logic');
