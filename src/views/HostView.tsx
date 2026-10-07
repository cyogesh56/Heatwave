import { useSyncTimer } from '../hooks/useSyncTimer';
import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { PlayingCard } from '../components/ui/PlayingCard';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalHeader } from '../components/ui/UniversalHeader';
import { GamePopup } from '../components/ui/GamePopup';
import { TimerBadge } from '../components/ui/TimerBadge';
import { soundEngine } from '../lib/audio/SoundEngine';
import { IconZap } from '../components/icons';

export const HostView: React.FC = () => {
  const { hostServer, hostGameState, setHostGameState, gameEngine } = useGame();
  
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [uiAlert, setUiAlert] = useState('');
  const [confirmEndGame, setConfirmEndGame] = useState(false);
  const timeLeft = useSyncTimer(hostGameState?.timers?.endsAt);
  
  React.useEffect(() => {
    // Attempt to init audio context early
    const initAudio = () => soundEngine.init();
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);
  const hostGameStateRef = React.useRef(hostGameState);
  React.useEffect(() => { hostGameStateRef.current = hostGameState; }, [hostGameState]);

  useEffect(() => {
    if (!gameEngine || !hostGameState) return;

    if (!hostGameState.currentCard) {
      handleNextCard();
    }
  }, [gameEngine]); // Only run when gameEngine initializes

  useEffect(() => {
    const handleAction = (e: any) => {
      const { playerId, action } = e.detail;
      if (action.type === 'vote') {
        setVotes(prev => ({ ...prev, [playerId]: action.choice }));
            } else if (action.type === 'power') {
         if (hostGameState?.uiState === 'interstitial') return;
         const inv = hostGameState?.players[playerId]?.inventory;
         const powerKey = action.power.startsWith('override') ? 'override' : action.power;
         if (!inv || inv[powerKey as keyof typeof inv] <= 0) return;
         setHostGameState((prev) => {
           if (!prev) return prev;
           const s = prev.stats || {};
           if (!s[playerId]) s[playerId] = { powersUsed: 0, truthsAnswered: 0, daresCompleted: 0, targetedCount: 0 };
           s[playerId].powersUsed++;
           return { ...prev, stats: s };
         });
         const pName = hostGameState?.players[playerId]?.name || 'Someone';
         if (action.power === 'killswitch') {
            const newPlayers = JSON.parse(JSON.stringify(hostGameState!.players));
            newPlayers[playerId].inventory.killswitch = Math.max(0, newPlayers[playerId].inventory.killswitch - 1);
            
            setHostGameState(prev => {
               if (!prev) return prev;
               const n = { 
                  ...prev, 
                  players: newPlayers, 
                  uiState: 'interstitial' as const, 
                  interstitial: { title: `${pName} used KILL!`.toUpperCase(), subtitle: 'Finding a random question now!' }
               };
               hostServer?.broadcast(n);
               return n;
            });
            setTimeout(() => { handleNextCard(); }, 3000);
         } else if (action.power.startsWith('override_')) {
            const targetPhase = parseInt(action.power.split('_')[1]);
            const phaseNames = ['The Spark', 'The Deepen', 'The Ignite', 'The Melt'];
            const phaseName = phaseNames[targetPhase - 1] || 'Unknown';
            const phaseSubs = [
               'Low stakes banter.',
               'Vulnerability.',
               'Sensual touch.',
               'High heat.'
            ];
            
            const newPlayers = JSON.parse(JSON.stringify(hostGameState!.players));
            newPlayers[playerId].inventory.override = Math.max(0, newPlayers[playerId].inventory.override - 1);

            setHostGameState(prev => {
               if (!prev) return prev;
               const n = { 
                  ...prev, 
                  players: newPlayers, 
                  uiState: 'interstitial' as const, 
                  interstitial: { title: `${pName} used OVERRIDE!`.toUpperCase(), subtitle: `Changing the category to ${phaseName}. ${phaseSubs[targetPhase - 1]}` }
               };
               hostServer?.broadcast(n);
               return n;
            });

            setTimeout(() => { 
               if (gameEngine) gameEngine.currentPhase = targetPhase;
               handleNextCard(false, true); // skip the normal interstitial since we just showed the override one
            }, 3000);
         } else if (action.power === 'deflect') {
            const targetName = hostGameState?.players[action.targetId]?.name || 'Someone';
            const newPlayers = JSON.parse(JSON.stringify(hostGameState!.players));
            newPlayers[playerId].inventory.deflect = Math.max(0, newPlayers[playerId].inventory.deflect - 1);

            let currentCard = { ...hostGameState!.currentCard! };
            if (currentCard.targetedPlayers && currentCard.targetedPlayers.length > 0) {
                const oldTarget = currentCard.targetedPlayers[0];
                currentCard.parsedPrompt = currentCard.parsedPrompt.replace(new RegExp(oldTarget, 'gi'), targetName);
                currentCard.targetedPlayers = [targetName];
            } else {
                // If there was no target (e.g. room discussion), just prepend the target's name
                currentCard.parsedPrompt = `${targetName}: ${currentCard.parsedPrompt}`;
                currentCard.targetedPlayers = [targetName];
            }

            setHostGameState(prev => {
               if (!prev) return prev;
               const n = { 
                  ...prev, 
                  players: newPlayers, 
                  currentCard,
                  uiState: 'interstitial' as const, 
                  interstitial: { title: `${pName} used DEFLECT!`.toUpperCase(), subtitle: `${targetName} answers the question now!` }
               };
               hostServer?.broadcast(n);
               return n;
            });

            setTimeout(() => { 
               setHostGameState(prev => {
                  if (!prev) return prev;
                  const n = { ...prev, uiState: 'voting' as const };
                  hostServer?.broadcast(n);
                  return n;
               });
            }, 3000);
         }
      } else if (action.type === 'fail_truth') {
         const pName = hostGameState?.players[playerId]?.name || 'Someone';
         setUiAlert(`😅 ${pName} failed! Drawing a TRUTH...`);
         
         setTimeout(() => {
           setUiAlert('');
           if (!gameEngine || !hostGameState) return;
           const players = Object.values(hostGameState.players).map(p => p.name);
           const drawn = gameEngine.drawNextCard(players, hostGameState.phase, 'truth');
           if (drawn) {
             setVotes({});
             const nextState = {
               ...hostGameState,
               currentCard: drawn,
               uiState: 'voting' as const
             };
             setHostGameState(nextState);
             hostServer?.broadcast(nextState);
           }
         }, 2500);
      }
    };
    window.addEventListener('player-action', handleAction);
    const handlePresence = (e: any) => {
       const connectedIds = e.detail.connectedIds as string[];
       setHostGameState(prev => {
          if (!prev) return prev;
          let changed = false;
          const newPlayers = { ...prev.players };
          for (const id of Object.keys(newPlayers)) {
             const isConnected = connectedIds.includes(id);
             if (newPlayers[id].isConnected !== isConnected) {
                newPlayers[id] = { ...newPlayers[id], isConnected };
                changed = true;
             }
          }
          if (changed) {
             const n = { ...prev, players: newPlayers };
             hostServer?.broadcast(n);
             return n;
          }
          return prev;
       });
    };
    window.addEventListener('presence-sync', handlePresence);
    return () => {
      window.removeEventListener('player-action', handleAction);
      window.removeEventListener('presence-sync', handlePresence);
    };
  }, [hostGameState, gameEngine]); // Dependencies needed to read latest state


  const startReveal = () => {
    if (hostGameState?.revealCountdown) return;
    setHostGameState(prev => {
      if (!prev) return prev;
      const n = { ...prev, revealCountdown: 5, timers: { ...prev.timers, active: false, remainingSeconds: 0 } };
      hostServer?.broadcast(n);
      return n;
    });
  };

  useEffect(() => {
    const activeCount = Object.values(hostGameState?.players || {}).filter((p: any) => p.isConnected !== false).length;
    let requiredVotes = activeCount;
    
    if (hostGameState?.currentCard?.assignedResponderName) {
      const responder = Object.entries(hostGameState.players || {}).find(([id, p]: [string, any]) => p.name === hostGameState.currentCard?.assignedResponderName);
      if (responder && responder[1].isConnected !== false) {
        requiredVotes = 1;
      }
    }

    if (hostGameState?.uiState === 'voting' && Object.keys(votes).length > 0 && Object.keys(votes).length >= requiredVotes) {
       startReveal();
    }
  }, [votes]);

  useEffect(() => {
    if (timeLeft <= 0 && hostGameState?.timers?.active && !hostGameState?.revealCountdown) {
       startReveal();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (hostGameState?.revealCountdown && hostGameState.revealCountdown > 0) {
       const t = setTimeout(() => {
          if (hostGameState.revealCountdown === 1) {
             handleNextCard();
          } else {
             setHostGameState(prev => {
                if (!prev) return prev;
                const n = { ...prev, revealCountdown: (prev.revealCountdown || 5) - 1 };
                hostServer?.broadcast(n);
                return n;
             });
          }
       }, 1000);
       return () => clearTimeout(t);
    }
  }, [hostGameState?.revealCountdown]);

  useEffect(() => {
    if (!hostGameState) return;
    const activeCount = Object.values(hostGameState.players || {}).filter((p: any) => p.isConnected !== false).length;
    
    if (hostGameState.readyPlayers && hostGameState.readyPlayers.length >= Math.ceil(activeCount / 2)) {
       startReveal();
    }

    if (hostGameState.juryState?.active) {
       const juryVotes = Object.values(hostGameState.juryState.votes);
       const requiredVotes = Math.max(1, activeCount - 1);
       if (juryVotes.length >= requiredVotes) {
          const yesVotes = juryVotes.filter(v => v === 'yes').length;
          if (yesVotes >= Math.ceil(requiredVotes / 2)) {
             startReveal();
          } else {
             window.dispatchEvent(new CustomEvent('player-action', { detail: { playerId: hostGameState.juryState.targetId, action: { type: 'fail_truth' } } }));
          }
       }
    }
  }, [hostGameState?.readyPlayers, hostGameState?.juryState?.votes]);


  const handleNextCard = (forceInterstitial = false, skipInterstitial = false) => {
    if (!gameEngine || !hostGameStateRef.current) return;
    const players = Object.values(hostGameStateRef.current!.players).map(p => p.name);
    const drawn = gameEngine.drawNextCard(players.length > 0 ? players : ['Player 1', 'Player 2']);
    
    // Loot drop logic
    const newPlayers = JSON.parse(JSON.stringify(hostGameStateRef.current!.players));
    const playerIds = Object.keys(newPlayers);
    let alertMsg = '';
    let targetPlayerId = '';
    
    if (!drawn) {
       setHostGameState(prev => {
          if (!prev) return null;
          const next = { ...prev, uiState: 'ended' as const };
          hostServer?.broadcast(next);
          return next;
       });
       return;
    }

    if (playerIds.length > 0 && Math.random() < 0.4) {
       const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
       const powers = ['deflect', 'killswitch', 'override'];
       const randomPower = powers[Math.floor(Math.random() * powers.length)];
       newPlayers[randomId].inventory[randomPower] += 1;
       alertMsg = `📦 ${newPlayers[randomId].name} discovered a ${randomPower.toUpperCase()}!`;
       newPlayers[randomId].uiAlert = `📦 You discovered a ${randomPower.toUpperCase()}!`;
       targetPlayerId = randomId;
    }

    if (drawn) {
      setVotes({});
      
      // Inject options for Kahoot/Consensus if missing, or Vibe Poll
      if (drawn.card.type === 'vibe_poll') {
         drawn.card.options = Object.values(newPlayers).map((p: any) => p.name);
      } else if (!drawn.card.options && (drawn.card.type === 'kahoot' || drawn.card.type === 'wrong_answers' || drawn.card.type === 'consensus' || drawn.card.type === 'fill_blank')) {
         // Treat questions without options as open-ended room discussions!
         drawn.card.type = 'truth';
      }

      // Interstitial Logic
      let showInterstitial = false;
      let interTitle = '';
      let interSub = '';
      const prevType = hostGameStateRef.current.currentCard?.card?.type;
      const prevPhase = hostGameStateRef.current.currentCard?.card?.phase;
      
      if (!skipInterstitial && (!prevType || prevType !== drawn.card.type || prevPhase !== drawn.card.phase || forceInterstitial)) {
          showInterstitial = true;
          if (prevPhase && prevPhase !== drawn.card.phase) {
             const phaseNames = ['The Spark', 'The Deepen', 'The Ignite', 'The Melt'];
             interTitle = `PHASE ${drawn.card.phase}: ${phaseNames[drawn.card.phase - 1] || 'HEAT'}`.toUpperCase();
             interSub = 'The heat rises. The vibe shifts.';
          } else {
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
                case 'fill_blank':
                case 'kahoot':
                   interTitle = 'Trivia & Chaos';
                   interSub = 'Pick the funniest or correct option on your phone.';
                   break;
             }
          }
      }

      // Timer Logic
      const delayMs = showInterstitial ? 3000 : 0;
      const isVoting = ['kahoot', 'wrong_answers', 'consensus', 'vibe_poll', 'fill_blank'].includes(drawn.card.type);
      const isDare = drawn.card.type === 'dare';
      
      let futureTimer = null;
      if (isVoting) {
         futureTimer = Date.now() + delayMs + 5000 + (30 * 1000); 
      } else if (isDare && drawn.card.prompt.includes('60')) {
         futureTimer = Date.now() + delayMs + 5000 + (60 * 1000);
      }

      const nextState = {
        ...hostGameStateRef.current,
        players: newPlayers,
        currentCard: drawn,
        uiState: showInterstitial ? 'interstitial' as const : 'voting' as const,
        interstitial: showInterstitial ? { title: interTitle, subtitle: interSub } : undefined,
        readyPlayers: [],
        juryState: undefined,
        revealCountdown: undefined,
        timers: {
          active: !!futureTimer,
          endsAt: futureTimer,
          remainingSeconds: 0
        },
        uiAlert: alertMsg || undefined
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
                const n = { ...prev, players: p, uiAlert: undefined };
                hostServer?.broadcast(n);
                return n;
             });
          }
        }, 4000 + delayMs);
      }
    } else {
      // Deck is empty, trigger game over
      setHostGameState(prev => {
        if (!prev) return null;
        const next = { ...prev, uiState: 'ended' as const };
        hostServer?.broadcast(next);
        return next;
      });
    }
  };

  if (!hostGameState?.currentCard) {

    return <div className="min-h-[100dvh] bg-canvas text-ink-primary flex items-center justify-center font-display text-2xl md:text-3xl lg:text-4xl">Loading Deck...</div>;
  }


  const connectedPlayers = Object.values(hostGameState.players).filter((p: any) => p.isConnected !== false);
  const disconnectedPlayers = Object.values(hostGameState.players).filter((p: any) => p.isConnected === false);
  
  if (connectedPlayers.length < 2 && disconnectedPlayers.length > 0) {
     return (
        <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-12 text-center">
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black uppercase tracking-widest mb-6">Game Paused</h1>
           <p className="text-3xl font-body opacity-90 mb-12">
              {disconnectedPlayers.map((p: any) => p.name).join(', ')} disconnected.<br/>Waiting for them to reconnect...
           </p>
           <button onClick={() => window.location.href = '/'} className="px-12 py-6 bg-canvas text-accent-dare font-display font-black text-2xl uppercase tracking-widest rounded-2xl shadow-solid active:translate-y-[4px] active:shadow-none hover:-translate-y-1 transition-all">
             Restart Game
           </button>
        </div>
     );
  }



  if (hostGameState.uiState === 'ended') {
    return (
      <div className="min-h-[100dvh] bg-canvas text-ink-primary flex flex-col items-center justify-center p-12 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-black text-accent-dare mb-6 uppercase tracking-widest">Game Over</h1>
        <p className="text-xl md:text-2xl font-body text-ink-primary/70 mb-12">The decks have run dry. The heat has subsided.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
          {Object.entries(hostGameState.players || {}).map(([id, p]: any) => (
             <div key={id} className="bg-surface-card p-6 rounded-3xl border-4 border-ink-primary/10 shadow-solid flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full border-4 border-ink-primary bg-accent-consensus-fill mb-4"></div>
                <h3 className="font-display font-black text-2xl uppercase tracking-widest">{p.name}</h3>
                <div className="mt-4 flex gap-4 opacity-70">
                  <div className="flex flex-col items-center">
                    <span className="font-meta font-bold text-2xl">{hostGameState.stats?.[id]?.powersUsed || 0}</span>
                    <span className="font-meta text-xs uppercase tracking-widest">Powers</span>
                  </div>
                </div>
             </div>
          ))}
        </div>

        <button 
          onClick={() => window.location.href = '/'} 
          className="px-12 py-6 bg-ink-primary text-canvas font-display font-black text-2xl uppercase tracking-widest rounded-[2rem] shadow-solid hover:-translate-y-2 transition-all active:translate-y-[4px] active:shadow-none"
        >
          Return to Lobby
        </button>
      </div>
    );
  }

  if (hostGameState.uiState === 'interstitial' && hostGameState.interstitial) {
     return (
        <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-12 text-center"
      >
        
           <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-black uppercase tracking-widest mb-6">{hostGameState.interstitial.title}</h1>
           <p className="text-xl md:text-3xl lg:text-5xl font-body opacity-90">{hostGameState.interstitial.subtitle}</p>
        
      </motion.div>
     );
  }

  const { card, parsedPrompt } = hostGameState.currentCard;

  const renderRevealArea = () => {
    if (!['kahoot', 'wrong_answers', 'consensus', 'vibe_poll', 'fill_blank'].includes(card.type)) {
      return (
        <div className="flex flex-col gap-8 w-full max-w-md items-center mt-0">
          <div className="relative group w-full">
            <div className="absolute inset-0 bg-accent-truth blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full"></div>
            <div className="relative bg-surface-card backdrop-blur-2xl border-2 border-accent-truth/40 px-12 py-8 rounded-[2rem] flex flex-col items-center gap-3 shadow-2xl transition-transform hover:scale-105 duration-300">
              <span className="font-meta text-accent-truth uppercase tracking-widest text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-truth animate-ping"></span>
                In the Spotlight
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-ink-primary opacity-90 uppercase">{card.type}</h2>
            </div>
          </div>
          {hostGameState?.revealCountdown ? (
     <div className="w-full py-6 bg-accent-truth text-canvas font-display font-black text-2xl uppercase tracking-widest rounded-3xl shadow-solid text-center animate-pulse">
       ADVANCING IN {hostGameState.revealCountdown}...
     </div>
  ) : (
     <button onClick={() => handleNextCard(false)} className="w-full py-4 bg-transparent border-4 border-ink-primary/20 text-ink-primary/40 font-display font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-ink-primary/5 transition-all">
       Force Advance
     </button>
  )}
          {parsedPrompt.toLowerCase().includes('answer a truth') && (
             <button onClick={() => window.dispatchEvent(new CustomEvent('player-action', { detail: { playerId: 'host', action: { type: 'fail_truth' } } }))} className="w-full py-4 bg-transparent border-4 border-accent-truth text-accent-truth font-display font-black text-xl uppercase tracking-widest rounded-2xl hover:bg-accent-truth/10 transition-all">
               Answer a Truth Instead
             </button>
          )}
        </div>
      );
    }

    const options = card.options || ['Option A', 'Option B', 'Option C', 'Option D'];
    const totalVotes = Object.keys(votes).length;

    return (
      <div className="w-full max-w-4xl mt-0 bg-surface-card backdrop-blur-xl rounded-3xl p-5 sm:p-8 border-2 border-ink-primary/10 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-ink-primary/10 pb-4 sm:pb-6 mb-4 sm:mb-6 gap-2 sm:gap-4">
          <h3 className="text-sm sm:text-xl font-meta uppercase tracking-widest text-ink-primary/90 text-center sm:text-left">
            {card.type === 'vibe_poll' ? 'Vibe Poll' : 
             card.type === 'kahoot' || card.type === 'wrong_answers' || card.type === 'fill_blank' ? 'Trivia & Chaos' : 
             'Consensus'} ({totalVotes} votes)
          </h3>
          {hostGameState?.timers?.active && (
            <div className={`text-3xl md:text-5xl lg:text-6xl font-display font-black tabular-nums tracking-tighter ${timeLeft <= 10 ? 'text-accent-wrong animate-pulse' : 'text-accent-consensus'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:gap-6">
          {options.map((opt: string, i: number) => {
            const voteCount = Object.values(votes).filter(v => v === opt).length;
            const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);
            
            const voters = Object.entries(votes)
              .filter(([id, v]) => v === opt)
              .map(([id]) => hostGameState.players[id]?.name)
              .filter(Boolean)
              .join(', ');
            return (
              <div key={i} className="flex items-center gap-2 sm:gap-4">
                <div className="w-24 sm:w-32 md:w-48 text-right font-bold text-xs sm:text-base opacity-90 truncate leading-tight" title={opt}>{opt}</div>
                <div className="flex-1 h-8 bg-canvas rounded-full shadow-inner overflow-hidden border border-ink-primary/5 relative">
                  <div 
                    className="h-full bg-accent-consensus transition-all duration-1000 ease-out relative"
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 0 && <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>}
                    {voters && (
                      <div className="absolute inset-0 flex items-center px-4 overflow-hidden">
                        <span className="font-meta text-xs uppercase tracking-widest text-ink-dark font-bold truncate z-10">{voters}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-16 font-meta text-xl text-accent-consensus">{percentage}%</div>
              </div>
            );
          })}
        </div>
        <button onClick={() => handleNextCard(false)} className="mt-6 sm:mt-8 w-full py-4 sm:py-6 bg-accent-dare text-canvas font-display font-black text-xl sm:text-2xl uppercase tracking-widest rounded-2xl shadow-solid active:translate-y-[4px] active:shadow-none hover:-translate-y-1 transition-all">
          Draw Next Card
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col transition-colors duration-500 bg-canvas text-ink-primary font-sans overflow-x-hidden">
      <GamePopup 
        isOpen={confirmEndGame} 
        title="End Game?" 
        message="Are you sure you want to end the game for everyone?" 
        type="confirm" 
        onConfirm={() => { setConfirmEndGame(false); if (hostServer) { setHostGameState(prev => { if (!prev) return null; const next = { ...prev, uiState: 'ended' as const }; hostServer.broadcast(next); return next; }); } }}
        onCancel={() => setConfirmEndGame(false)}
        accent="dare" 
      />
      
      <audio src="/arpmedia-bedroom-night-sensual-massage-569465.mp3" autoPlay loop muted={false} />
      <UniversalHeader
        leftNode={
          <div className="text-xl sm:text-2xl lg:text-4xl font-black tracking-widest bg-ink-primary/5 px-4 lg:px-5 py-1.5 lg:py-2 rounded-2xl border border-ink-primary/20 shadow-inner">
            #{hostServer?.roomCode || 'GAME'}
          </div>
        }
        rightNode={
          <button 
            onClick={() => setConfirmEndGame(true)}
            className="font-meta font-bold text-sm tracking-widest uppercase text-accent-dare hover:bg-accent-dare/10 px-4 py-2 rounded-2xl shadow-solid-sm active:translate-y-[2px] active:shadow-none transition-all transition-colors"
          >
            End Game
          </button>
        }
      />

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 pb-32 lg:p-12 gap-4 sm:gap-8 lg:gap-16 relative z-0 w-full max-w-[1600px] mx-auto overflow-visible">
        {/* Left Side: Card */}
        <div className="relative w-full lg:w-1/2 flex items-center justify-center shrink-0">
          <div className="w-full max-w-md lg:max-w-xl aspect-[4/3] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={card.id}
              initial={{ y: 200, opacity: 0, scale: 0.8, rotate: 3 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
              exit={{ y: -200, opacity: 0, scale: 0.8, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
              className="absolute inset-0"
            >
              <PlayingCard 
                prompt={parsedPrompt}
                type={card.type === 'kahoot' ? 'wrong' : card.type}
                index={hostGameState.phase}
              />
            </motion.div>
          </AnimatePresence>

        </div>
        </div>
        {/* Right Side: Reveal Area */}
        <div className="w-full lg:w-1/2 flex items-center justify-center shrink-0 p-6 sm:p-8 min-h-[300px]">
          {renderRevealArea()}
        </div>
      </main>

      <AnimatePresence>
        {uiAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-24 lg:top-auto lg:bottom-32 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none w-11/12 max-w-lg"
          >
            <div className="bg-surface-card text-ink-primary border-4 border-accent-dare rounded-2xl px-6 py-4 shadow-2xl text-center backdrop-blur-xl">
              <span className="text-sm lg:text-base font-display font-black uppercase tracking-widest leading-snug">
                {uiAlert}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Bottom Bar: Online Players */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-surface-card/90 backdrop-blur-md px-8 py-4 rounded-2xl border-2 border-ink-primary/10 shadow-xl z-50">
        {Object.entries(hostGameState.players).map(([id, p]: any) => (
           <div key={id} className="flex items-center gap-2">
             <div className={`w-3 h-3 rounded-full shadow-solid-sm ${p.isConnected !== false ? 'bg-[#10B981]' : 'bg-accent-dare'}`} />
             <span className="font-meta text-sm font-bold uppercase tracking-widest text-ink-primary/70">{p.name}</span>
           </div>
        ))}
      </div>
    </div>
  );
};

