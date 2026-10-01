const fs = require('fs');

let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

const targetFunction = `  const handleNextCard = () => {`;
const split1 = hv.split(targetFunction);
const split2 = split1[1].split(`  if (!hostGameState?.currentCard) {`);

const newHandleNext = `  const handleNextCard = () => {
    if (!gameEngine || !hostGameState) return;
    const players = Object.values(hostGameState.players).map(p => p.name);
    const drawn = gameEngine.drawNextCard(players.length > 0 ? players : ['Player 1', 'Player 2']);
    
    // Loot drop logic
    const newPlayers = JSON.parse(JSON.stringify(hostGameState.players));
    const playerIds = Object.keys(newPlayers);
    let alertMsg = '';
    let targetPlayerId = '';
    
    if (playerIds.length > 0 && Math.random() < 0.4) {
       const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
       const powers = ['deflect', 'killswitch', 'override'];
       const randomPower = powers[Math.floor(Math.random() * powers.length)];
       newPlayers[randomId].inventory[randomPower] += 1;
       alertMsg = \`📦 \${newPlayers[randomId].name} discovered a \${randomPower.toUpperCase()}!\`;
       newPlayers[randomId].uiAlert = \`📦 You discovered a \${randomPower.toUpperCase()}!\`;
       targetPlayerId = randomId;
    }

    if (drawn) {
      setVotes({});
      
      // Inject options for Kahoot/Consensus if missing, or Vibe Poll
      if (drawn.card.type === 'vibe_poll') {
         drawn.card.options = Object.values(newPlayers).map((p: any) => p.name);
      } else if (!drawn.card.options && (drawn.card.type === 'kahoot' || drawn.card.type === 'wrong_answers' || drawn.card.type === 'consensus')) {
         // Treat questions without options as open-ended room discussions!
         drawn.card.type = 'truth';
      }

      // Interstitial Logic
      let showInterstitial = false;
      let interTitle = '';
      let interSub = '';
      const prevType = hostGameState.currentCard?.card?.type;
      
      if (prevType && prevType !== drawn.card.type) {
          showInterstitial = true;
          switch (drawn.card.type) {
             case 'truth':
             case 'fill_blank':
                interTitle = 'Room Discussion';
                interSub = 'Answer out loud. No voting.';
                break;
             case 'dare':
                interTitle = 'Physical Challenge';
                interSub = 'Time to act. Complete the dare.';
                break;
             case 'consensus':
             case 'vibe_poll':
                interTitle = 'Consensus Check';
                interSub = 'Look at your phone. Vote to agree.';
                break;
             case 'wrong_answers':
             case 'kahoot':
                interTitle = 'Trivia & Chaos';
                interSub = 'Pick the funniest or correct option on your phone.';
                break;
          }
      }

      // Timer Logic
      const delayMs = showInterstitial ? 3000 : 0;
      const isVoting = ['kahoot', 'wrong_answers', 'consensus', 'vibe_poll'].includes(drawn.card.type);
      const isDare = drawn.card.type === 'dare';
      
      let futureTimer = null;
      if (isVoting) {
         futureTimer = Date.now() + delayMs + 5000 + (30 * 1000); 
      } else if (isDare && drawn.card.prompt.includes('60')) {
         futureTimer = Date.now() + delayMs + 5000 + (60 * 1000);
      }

      const nextState = {
        ...hostGameState,
        players: newPlayers,
        currentCard: drawn,
        uiState: showInterstitial ? 'interstitial' as const : 'voting' as const,
        interstitial: showInterstitial ? { title: interTitle, subtitle: interSub } : undefined,
        timers: {
          active: !!futureTimer,
          endsAt: futureTimer,
          remainingSeconds: 0
        }
      };
      
      setHostGameState(nextState);
      hostServer?.broadcast(nextState);
      
      if (showInterstitial) {
         setTimeout(() => {
            setHostGameState(prev => {
               if (!prev) return prev;
               const resumedState = { ...prev, uiState: 'voting' as const };
               hostServer?.broadcast(resumedState);
               return resumedState;
            });
         }, 3000);
      }
      
      if (alertMsg) {
        setUiAlert(alertMsg);
        setTimeout(() => {
          setUiAlert('');
          if (targetPlayerId) {
             setHostGameState(prev => {
                if (!prev) return prev;
                const p = { ...prev.players };
                if (p[targetPlayerId]) {
                   p[targetPlayerId] = { ...p[targetPlayerId], uiAlert: undefined };
                }
                const n = { ...prev, players: p };
                hostServer?.broadcast(n);
                return n;
             });
          }
        }, 4000 + delayMs);
      }
    }
  };

`;

hv = split1[0] + newHandleNext + "  if (!hostGameState?.currentCard) {\n" + split2[1];
fs.writeFileSync('src/views/HostView.tsx', hv);
console.log('Handle next card fixed');
