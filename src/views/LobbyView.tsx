import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useGame } from '../context/GameContext';
import { Card } from '../lib/engine/stateMachine';
import { IconZap, IconUsers, IconFlame, IconSpark } from '../components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalHeader } from '../components/ui/UniversalHeader';
import { GamePopup } from '../components/ui/GamePopup';

const DECKS = [
  { id: 'couples', name: 'Couples', desc: 'The classic experience. Deep questions, absurd dares, and high-tension consensus.' },
  { id: 'new_friends', name: 'New Friends', desc: 'Icebreakers and low-stakes petty debates. Perfect for acquaintances.' },
  { id: 'first_date', name: 'First Date', desc: 'Innocent touch barriers and getting to know each other. No heavy baggage.' },
  { id: 'polyamory', name: 'The Polycule', desc: 'Group dynamics, compersion, and multi-person physical dares.' },
  { id: 'after_dark', name: 'After Dark', desc: 'High heat, power dynamics, and uninhibited fantasies. Adults only.' }
];

export default function LobbyView() {
  const navigate = useNavigate();
  const { hostServer, hostGameState, setHostGameState, startGame, isHost, initClient } = useGame();
  const [selectedDecks, setSelectedDecks] = useState<string[]>(['couples']);
  const [step, setStep] = useState<'connect' | 'intent' | 'vibe' | 'rules'>('connect');
  const [intent, setIntent] = useState<'friends' | 'couples' | 'poly' | null>(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [chaosMode, setChaosMode] = useState(false);
  const [chillMode, setChillMode] = useState(false);
  const [hostPlayerName, setHostPlayerName] = useState('');
  const isHostless = sessionStorage.getItem('hostlessMode') === 'true';

  if (!isHost || !hostServer) {
    return <div className="p-8 text-ink-primary bg-canvas min-h-[100dvh]">Not a host. <button onClick={() => step === 'rules' ? (intent === 'friends' ? setStep('intent') : setStep('vibe')) : (step === 'vibe' ? setStep('intent') : (step === 'intent' ? setStep('connect') : navigate('/')))}>Go back</button></div>;
  }

  const roomCode = hostServer.roomCode;
  const joinUrl = `${window.location.origin}/?room=${roomCode}`;
  const connectedPlayers = Object.values(hostGameState?.players || {});

  const toggleDeck = (id: string) => {
    setSelectedDecks(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleStart = async () => {
    const res = await fetch('/cards.json');
    const allCards: Card[] = await res.json();
    
    // Filter the cards mathematically to only those belonging to the selected decks
    const filteredCards = allCards.filter(card => 
      card.decks && card.decks.some(d => selectedDecks.includes(d))
    );

    if (filteredCards.length === 0) {
      setPopupMessage("No cards found for the selected decks! Please select different decks.");
      return;
    }
    
    startGame(filteredCards);
    if (isHostless) {
      if (!hostPlayerName.trim()) { setPopupMessage("Please enter your name!"); return; }
      await initClient(hostServer?.roomCode || '', hostPlayerName);
      navigate('/host'); // We still need HostView to mount the game loop!
    } else {
      navigate('/host');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-canvas transition-colors duration-700 flex flex-col text-ink-primary relative overflow-hidden">
      <GamePopup isOpen={!!popupMessage} title="Empty Deck" message={popupMessage} onConfirm={() => setPopupMessage('')} accent="wrong" />
      
      <audio src="/saavane-sensual-music-390794.mp3" autoPlay loop muted={false} />
      <UniversalHeader 
        leftNode={<button onClick={() => step === 'rules' ? (intent === 'friends' ? setStep('intent') : setStep('vibe')) : (step === 'vibe' ? setStep('intent') : (step === 'intent' ? setStep('connect') : navigate('/')))} className="font-meta uppercase tracking-widest text-ink-primary/60 hover:text-ink-primary">← Back</button>}
        rightNode={<div className="font-meta uppercase tracking-widest text-xs sm:text-sm font-bold text-ink-primary/40 shrink-0">Step {step === 'connect' ? '1' : step === 'intent' ? '2' : step === 'vibe' ? '3' : '4'}</div>}
      />
      <div className="flex-1 w-full flex flex-col p-6 lg:p-8 overflow-y-auto">
        <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-widest text-center mb-8">Handsy Setup</h1>

      <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col h-full">
        
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

            <div className="w-full max-w-sm flex-1 flex flex-col justify-end">
              <button 
                onClick={() => setStep('intent')}
                disabled={connectedPlayers.length < 2}
                className="w-full py-5 bg-accent-consensus text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 transition-all active:scale-95"
              >
                {connectedPlayers.length < 2 ? 'Waiting for players...' : 'Next'}
              </button>
            </div>
          </div>
        )}

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
                  <IconFlame className="w-7 h-7 text-accent-truth" />
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
                  <IconZap className="w-7 h-7 text-accent-dare" />
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
                  if (intent === 'poly') setSelectedDecks(['polyamory']); // In poly, first date just uses standard poly without after dark
                  setStep('rules'); 
                }}
                className="bg-surface-card p-6 rounded-3xl border-4 border-accent-consensus shadow-solid-sm cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-accent-consensus/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <IconSpark className="w-7 h-7 text-accent-consensus" />
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
                  <IconFlame className="w-7 h-7 text-accent-dare" />
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
            
            {isHostless && (
              <div className="flex flex-col gap-2 mb-6">
                <label className="font-meta font-bold text-xs uppercase tracking-widest text-ink-primary/50">Your Display Name</label>
                <input 
                  type="text" 
                  maxLength={12}
                  value={hostPlayerName}
                  onChange={(e) => setHostPlayerName(e.target.value)}
                  placeholder="e.g. Maverick"
                  className="w-full bg-surface-card text-ink-primary text-xl font-body p-4 rounded-2xl border-4 border-ink-primary/10 focus:border-accent-consensus outline-none transition-colors shadow-solid-sm"
                />
              </div>
            )}
            
            <div className="flex flex-col gap-4 mb-8">
               <div onClick={() => setChaosMode(!chaosMode)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-solid-sm ${chaosMode ? 'bg-accent-dare-fill border-ink-primary text-ink-dark' : 'bg-surface-card border-ink-primary/20 text-ink-primary'}`}>
                 <div className="flex flex-col">
                   <span className="font-display font-black uppercase tracking-widest text-lg">Chaos Mode</span>
                   <span className="font-body text-sm opacity-80">3x more likely to drop Powers.</span>
                 </div>
                 <div className={`w-12 h-6 rounded-full border-2 ${chaosMode ? 'bg-ink-primary border-ink-primary' : 'bg-transparent border-ink-primary/30'} flex items-center p-1 transition-all`}>
                   <div className={`w-4 h-4 rounded-full bg-surface-card transition-all ${chaosMode ? 'translate-x-6' : 'translate-x-0 bg-ink-primary/30'}`}/>
                 </div>
               </div>
               
               <div onClick={() => setChillMode(!chillMode)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-solid-sm ${chillMode ? 'bg-accent-consensus-fill border-ink-primary text-ink-dark' : 'bg-surface-card border-ink-primary/20 text-ink-primary'}`}>
                 <div className="flex flex-col">
                   <span className="font-display font-black uppercase tracking-widest text-lg">Chill Mode</span>
                   <span className="font-body text-sm opacity-80">Disables all countdown timers.</span>
                 </div>
                 <div className={`w-12 h-6 rounded-full border-2 ${chillMode ? 'bg-ink-primary border-ink-primary' : 'bg-transparent border-ink-primary/30'} flex items-center p-1 transition-all`}>
                   <div className={`w-4 h-4 rounded-full bg-surface-card transition-all ${chillMode ? 'translate-x-6' : 'translate-x-0 bg-ink-primary/30'}`}/>
                 </div>
               </div>
            </div>
            
            <div className="mt-auto">
              <button 
                onClick={() => {
                  setHostGameState((prev: any) => prev ? { ...prev, settings: { chaosMode, chillMode } } : prev);
                  handleStart();
                }}
                disabled={isHostless && !hostPlayerName.trim()}
                className="w-full py-5 bg-ink-primary text-canvas disabled:opacity-50 font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95"
              >
                {isHostless && !hostPlayerName.trim() ? 'Enter Name to Launch' : (chaosMode || chillMode ? 'Launch Custom Game' : 'Play Default Rules')}
              </button>
            </div>
          </div>
        )}
        
        {/* Persistent Connected Players Dock */}
        <div className="w-full mt-6 bg-ink-primary/5 p-5 sm:p-6 rounded-3xl border border-ink-primary/5 shrink-0">
          <h3 className="font-meta text-xs uppercase tracking-widest font-bold mb-3 text-ink-primary/50">Lobby ({connectedPlayers.length}/4)</h3>
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {connectedPlayers.length === 0 ? (
              <div className="text-ink-primary/40 font-bold italic font-body text-sm sm:text-base">Waiting for players...</div>
            ) : (
              <AnimatePresence>
                {connectedPlayers.map((p, i) => (
                  <motion.div 
                    key={p.name} // using name as key instead of index for stable animations
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

      </div>
    </div>
    </div>
  );
}
