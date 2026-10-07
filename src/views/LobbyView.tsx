import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useGame } from '../context/GameContext';
import { Card } from '../lib/engine/stateMachine';
import { IconUsers, IconFlame, IconCouple, IconPoly, IconArrowLeft, IconDrink, IconMoon } from '../components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalHeader } from '../components/ui/UniversalHeader';
import { GamePopup } from '../components/ui/GamePopup';

export default function LobbyView() {
  const navigate = useNavigate();
  const { hostServer, hostGameState, setHostGameState, startGame, isHost, initClient, clientNode } = useGame();
  
  const [selectedDecks, setSelectedDecks] = useState<string[]>(['couples']);
  const [step, setStep] = useState<'intent' | 'vibe' | 'rules' | 'connect'>('intent');
  const [intent, setIntent] = useState<'friends' | 'couples' | 'poly' | null>(null);
  const [popupMessage, setPopupMessage] = useState('');
  
  const [chaosMode, setChaosMode] = useState(false);
  const [chillMode, setChillMode] = useState(false);
  
  const [hostPlayerName, setHostPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const isHostless = sessionStorage.getItem('hostlessMode') === 'true';

  if (!isHost || !hostServer) {
    return (
      <div className="p-8 text-ink-primary bg-canvas min-h-[100dvh]">
        Not a host. <button onClick={() => navigate('/')}>Go back</button>
      </div>
    );
  }

  const roomCode = hostServer.roomCode;
  const joinUrl = `${window.location.origin}/?room=${roomCode}`;
  const connectedPlayers = Object.values(hostGameState?.players || {});

  const handleStart = async () => {
    const res = await fetch('/cards.json');
    const allCards: Card[] = await res.json();
    
    const filteredCards = allCards.filter(card => 
      card.decks && card.decks.some(d => selectedDecks.includes(d))
    );

    if (filteredCards.length === 0) {
      setPopupMessage("No cards found for the selected decks! Please select different decks.");
      return;
    }
    
    startGame(filteredCards);
    navigate('/host');
  };

  const getStepNumber = () => {
    if (step === 'intent') return '1';
    if (step === 'vibe') return '2';
    if (step === 'rules') return intent === 'friends' ? '2' : '3';
    return intent === 'friends' ? '3' : '4';
  };

  const handleBack = () => {
    if (step === 'connect') setStep('rules');
    else if (step === 'rules') intent === 'friends' ? setStep('intent') : setStep('vibe');
    else if (step === 'vibe') setStep('intent');
    else navigate('/');
  };

  return (
    <div className="min-h-[100dvh] bg-canvas flex flex-col text-ink-primary relative">
      <GamePopup isOpen={!!popupMessage} title="Error" message={popupMessage} onConfirm={() => setPopupMessage('')} accent="wrong" />
      
      <UniversalHeader 
        leftNode={<button onClick={handleBack} className="font-meta uppercase tracking-widest text-ink-primary/60 hover:text-ink-primary"><div className="flex items-center gap-2"><IconArrowLeft className="w-5 h-5" /> Back</div></button>} 
        rightNode={<div className="font-meta uppercase tracking-widest text-xs sm:text-sm font-bold text-ink-primary/40 shrink-0">Step {getStepNumber()}</div>}
      />
      
      <div className="flex-1 w-full flex flex-col p-6 lg:p-8 overflow-y-auto">
        <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-widest text-center mb-8">Handsy Setup</h1>

        <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col h-full">
          
          {step === 'intent' && (
            <div className="flex-1 w-full flex flex-col items-center justify-center pt-8 pb-4">
              <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-widest mb-6 text-center">Who are you playing with?</h2>
              
              <div className="flex flex-col gap-4 w-full max-w-lg">
                <motion.div 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setIntent('friends'); setSelectedDecks(['just_friends']); setStep('rules'); }}
                  className="bg-surface-card p-6 rounded-3xl border-4 border-accent-consensus shadow-solid-sm cursor-pointer flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-full bg-accent-consensus/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <IconUsers className="w-7 h-7 text-accent-consensus" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display font-black text-xl uppercase tracking-widest">New Friends</h3>
                    <p className="font-body text-ink-primary/60 text-sm font-medium">Up to 8 players. Casual & fun group party. No after-dark content.</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setIntent('couples'); setStep('vibe'); }}
                  className="bg-surface-card p-6 rounded-3xl border-4 border-accent-truth shadow-solid-sm cursor-pointer flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-full bg-accent-truth/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <IconCouple className="w-7 h-7 text-accent-truth" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display font-black text-xl uppercase tracking-widest">Couples</h3>
                    <p className="font-body text-ink-primary/60 text-sm font-medium">2 players. Intimate, revealing, and deeply personal.</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setIntent('poly'); setStep('vibe'); }}
                  className="bg-surface-card p-6 rounded-3xl border-4 border-accent-dare shadow-solid-sm cursor-pointer flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-full bg-accent-dare/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <IconPoly className="w-7 h-7 text-accent-dare" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display font-black text-xl uppercase tracking-widest">The Polycule</h3>
                    <p className="font-body text-ink-primary/60 text-sm font-medium">3-4 players. Group dynamics, compersion, and multi-target tension.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {step === 'vibe' && (
            <div className="flex-1 w-full flex flex-col items-center justify-center pt-8 pb-4">
              <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-widest mb-6 text-center">Set the Vibe</h2>
              
              <div className="flex flex-col gap-4 w-full max-w-lg">
                <motion.div 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { 
                    if (intent === 'couples') setSelectedDecks(['first_date']);
                    if (intent === 'poly') setSelectedDecks(['polyamory']);
                    setStep('rules'); 
                  }}
                  className="bg-surface-card p-6 rounded-3xl border-4 border-accent-consensus shadow-solid-sm cursor-pointer flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-full bg-accent-consensus/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <IconDrink className="w-7 h-7 text-accent-consensus" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display font-black text-xl uppercase tracking-widest">First Date</h3>
                    <p className="font-body text-ink-primary/60 text-sm font-medium">Light, fun, breaking the ice safely.</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { 
                    if (intent === 'couples') setSelectedDecks(['couples', 'after_dark']);
                    if (intent === 'poly') setSelectedDecks(['polyamory', 'after_dark']);
                    setStep('rules'); 
                  }}
                  className="bg-surface-card p-6 rounded-3xl border-4 border-accent-dare shadow-solid-sm cursor-pointer flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-full bg-accent-dare/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <IconMoon className="w-7 h-7 text-accent-dare" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display font-black text-xl uppercase tracking-widest">After Dark</h3>
                    <p className="font-body text-ink-primary/60 text-sm font-medium">Intense, NSFW, high heat and deep vulnerability.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {step === 'rules' && (
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 max-w-2xl mx-auto w-full pt-4 pb-2">
              <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-widest mb-2">House Rules</h2>
              <p className="font-body text-ink-primary/70 mb-6 sm:mb-8 font-medium">Customize the chaos, or just play vanilla.</p>
              
              <div className="flex flex-col gap-4 mb-8">
                 <div onClick={() => { setChaosMode(false); setChillMode(false); }} className="p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-solid-sm bg-surface-card border-ink-primary/20 text-ink-primary hover:-translate-y-0.5">
                   <div className="flex flex-col">
                     <span className="font-display font-black uppercase tracking-widest text-lg">Vanilla</span>
                     <span className="font-body text-sm opacity-80">The default, highly-tested experience.</span>
                   </div>
                   <div className={`w-12 h-6 rounded-full border-2 ${(!chaosMode && !chillMode) ? 'bg-ink-primary border-ink-primary' : 'bg-ink-primary/5 border-ink-primary/30'} flex items-center p-1 transition-all`}>
                     <div className={`w-4 h-4 rounded-full transition-all ${(!chaosMode && !chillMode) ? 'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary'}`}/>
                   </div>
                 </div>

                 <div onClick={() => setChaosMode(!chaosMode)} className="p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-solid-sm bg-surface-card border-ink-primary/20 text-ink-primary hover:-translate-y-0.5">
                   <div className="flex flex-col">
                     <span className="font-display font-black uppercase tracking-widest text-lg">Chaos Mode</span>
                     <span className="font-body text-sm opacity-80">3x more likely to drop Powers.</span>
                   </div>
                   <div className={`w-12 h-6 rounded-full border-2 ${chaosMode ? 'bg-ink-primary border-ink-primary' : 'bg-ink-primary/5 border-ink-primary/30'} flex items-center p-1 transition-all`}>
                     <div className={`w-4 h-4 rounded-full transition-all ${chaosMode ? 'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary'}`}/>
                   </div>
                 </div>
                 
                 <div onClick={() => setChillMode(!chillMode)} className="p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-solid-sm bg-surface-card border-ink-primary/20 text-ink-primary hover:-translate-y-0.5">
                   <div className="flex flex-col">
                     <span className="font-display font-black uppercase tracking-widest text-lg">Chill Mode</span>
                     <span className="font-body text-sm opacity-80">Disables all countdown timers.</span>
                   </div>
                   <div className={`w-12 h-6 rounded-full border-2 ${chillMode ? 'bg-ink-primary border-ink-primary' : 'bg-ink-primary/5 border-ink-primary/30'} flex items-center p-1 transition-all`}>
                     <div className={`w-4 h-4 rounded-full transition-all ${chillMode ? 'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary'}`}/>
                   </div>
                 </div>
              </div>
              
              <div className="mt-auto">
                <button 
                  onClick={() => {
                    setHostGameState((prev: any) => prev ? { ...prev, settings: { chaosMode, chillMode } } : prev);
                    setStep('connect');
                  }}
                  className="w-full py-5 bg-ink-primary text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 'connect' && (
            <div className="flex-1 flex flex-col items-center gap-8 w-full justify-center">
              <div className="bg-surface-card w-full max-w-sm p-6 sm:p-8 rounded-[2rem] shadow-solid border-4 border-ink-primary/10 flex flex-col items-center relative">
                <h2 className="font-meta font-bold uppercase tracking-widest text-ink-primary/50 mb-4 text-xs sm:text-sm">Scan to Join</h2>
                <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-inner border border-ink-primary/5 mb-6">
                  <QRCodeSVG value={joinUrl} size={160} />
                </div>
                <div className="text-5xl sm:text-6xl font-mono tracking-[0.2em] font-black">{roomCode}</div>
                <p className="font-body text-ink-primary/50 mt-2 font-medium">{window.location.host}</p>
              </div>

              <div className="w-full max-w-sm flex-1 flex flex-col justify-end gap-4">
                {isHostless && !clientNode && (
                  <div className="flex flex-col gap-2 p-4 bg-surface-card border-4 border-accent-dare/20 rounded-2xl mb-2">
                    <label className="font-meta font-bold text-xs uppercase tracking-widest text-ink-primary/50 text-center">Join as Player 1</label>
                    <input 
                      type="text" 
                      maxLength={12}
                      value={hostPlayerName}
                      onChange={(e) => setHostPlayerName(e.target.value)}
                      placeholder="Your Name"
                      disabled={isJoining}
                      className="w-full bg-canvas text-ink-primary text-center text-xl font-body p-3 rounded-xl border-2 border-ink-primary/10 focus:border-accent-dare outline-none transition-colors disabled:opacity-50"
                    />
                    <button 
                      onClick={async () => {
                        setIsJoining(true);
                        try { await initClient(hostServer?.roomCode || '', hostPlayerName); } catch(e) { console.error(e); }
                        setIsJoining(false);
                      }}
                      disabled={!hostPlayerName.trim() || isJoining}
                      className="w-full mt-2 py-3 bg-accent-dare text-canvas font-display font-bold text-lg uppercase tracking-widest rounded-xl disabled:opacity-50 active:scale-95 transition-all"
                    >
                      {isJoining ? 'Joining...' : 'Join'}
                    </button>
                  </div>
                )}

                {(() => {
                  let limitMsg = '';
                  let isValid = false;
                  
                  if (intent === 'couples') {
                    isValid = connectedPlayers.length === 2;
                    if (connectedPlayers.length < 2) limitMsg = 'Waiting for 1 more...';
                    else if (connectedPlayers.length > 2) limitMsg = 'Too many players (Max 2)';
                  } else if (intent === 'poly') {
                    isValid = connectedPlayers.length >= 3 && connectedPlayers.length <= 4;
                    if (connectedPlayers.length < 3) limitMsg = 'Waiting for players...';
                    else if (connectedPlayers.length > 4) limitMsg = 'Too many players (Max 4)';
                  } else {
                    isValid = connectedPlayers.length >= 2 && connectedPlayers.length <= 8;
                    if (connectedPlayers.length < 2) limitMsg = 'Waiting for players...';
                    else if (connectedPlayers.length > 8) limitMsg = 'Too many players (Max 8)';
                  }
                  
                  const isReady = isValid && !(isHostless && !clientNode);
                  
                  return (
                    <button 
                      onClick={handleStart}
                      disabled={!isReady}
                      className="w-full py-5 bg-accent-consensus text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 transition-all active:scale-95"
                    >
                      {!isReady ? (limitMsg || 'Complete Setup') : 'Start Game'}
                    </button>
                  );
                })()}
              </div>
            </div>
          )}
          
          {/* Persistent Connected Players Dock */}
          {step === 'connect' && (
            <div className="w-full mt-6 bg-ink-primary/5 p-5 sm:p-6 rounded-3xl border border-ink-primary/5 shrink-0">
              <h3 className="font-meta text-xs uppercase tracking-widest font-bold mb-3 text-ink-primary/50">Lobby</h3>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {connectedPlayers.length === 0 ? (
                  <div className="text-ink-primary/40 font-bold italic font-body text-sm sm:text-base">Waiting for players...</div>
                ) : (
                  <AnimatePresence>
                    {connectedPlayers.map((p, i) => (
                      <motion.div 
                        key={p.name}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-surface-card rounded-full shadow-solid-sm border-2 border-ink-primary/20 font-bold font-body text-sm sm:text-base"
                      >
                        {p.name}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
