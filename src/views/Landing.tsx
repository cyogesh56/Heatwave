import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { GamePopup } from '../components/ui/GamePopup';
import { IconFlame, IconUsers, IconZap, IconOnTheGo, IconConnect } from '../components/icons';
import { UniversalHeader } from '../components/ui/UniversalHeader';

export default function Landing() {
  const navigate = useNavigate();
  const { initClient, initHost } = useGame();
  
  const [step, setStep] = useState<'hero' | 'setup' | 'join'>(new URLSearchParams(window.location.search).get('room') ? 'join' : 'hero');
  const searchParams = new URLSearchParams(window.location.search);
  const [roomCode, setRoomCode] = useState(searchParams.get('room') || '');
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.length === 6 && playerName.trim()) {
      setIsJoining(true);
      try {
        localStorage.setItem('handsy_room', roomCode);
        localStorage.setItem('handsy_name', playerName);
        await initClient(roomCode, playerName);
        navigate('/play');
      } catch (err: any) {
        setPopupMessage('Failed to connect: ' + (err.message || 'Unknown error'));
        localStorage.removeItem('handsy_room');
        localStorage.removeItem('handsy_name');
        setIsJoining(false);
      }
    }
  };

  const [isHosting, setIsHosting] = useState(false);

  const handleHost = async () => {
    setIsHosting(true);
    await initHost();
    navigate('/lobby');
  };

  if (step === 'hero') {
    return (
      <div className="min-h-[100dvh] bg-canvas flex flex-col items-center justify-center p-6 text-ink-primary relative overflow-hidden">
        <GamePopup isOpen={!!popupMessage} title="Error" message={popupMessage} onConfirm={() => setPopupMessage('')} accent="wrong" />
        <div className="text-center z-10 flex flex-col items-center relative">
          <motion.div 
            initial={{ scale: 200 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25, bounce: 0, duration: 0.2 }}
            className="w-20 h-20 bg-accent-truth/10 rounded-full flex items-center justify-center mb-6 shadow-inner relative z-50"
          >
            <div className="absolute inset-0 bg-accent-truth blur-xl opacity-20 rounded-full"></div>
            <IconFlame className="w-10 h-10 text-accent-truth relative z-10" fill="currentColor" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="text-4xl sm:text-6xl lg:text-8xl font-display font-black mb-4 tracking-tighter uppercase"
          >
            Handsy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="text-xl sm:text-2xl font-body text-ink-primary/70 mb-8 sm:mb-12 max-w-sm mx-auto font-medium"
          >
            The party game for people who hate party games.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: 'spring' }}
            onClick={() => setStep('setup')}
            className="mt-6 sm:mt-8 w-full max-w-[280px] sm:max-w-sm py-4 sm:py-5 bg-accent-truth text-canvas font-display font-bold text-lg sm:text-2xl uppercase tracking-widest rounded-full shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            Enter the Fire
          </motion.button>
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            onClick={() => setShowHelp(true)}
            className="mt-4 font-meta text-sm font-bold uppercase tracking-widest text-ink-primary/50 hover:text-ink-primary transition-colors underline decoration-2 underline-offset-4"
          >
            How to Play?
          </motion.button>
        </div>

        {/* HOW TO PLAY SHEET */}
        <div className={`absolute bottom-0 left-0 w-full max-h-[85vh] overflow-y-auto bg-surface-card rounded-t-[2rem] border-t-4 border-ink-primary shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 p-6 sm:p-10 flex flex-col gap-8 ${showHelp ? 'translate-y-0' : 'translate-y-[120%]'}`}>
          <div className="w-16 h-1.5 bg-ink-primary/20 rounded-full mx-auto shrink-0 -mt-2" />
          
          <div className="flex justify-between items-center">
             <h3 className="font-display font-black uppercase tracking-widest text-3xl text-ink-primary">How to Play</h3>
             <button onClick={() => setShowHelp(false)} className="w-10 h-10 bg-ink-primary/5 rounded-full flex items-center justify-center font-display font-black text-xl text-ink-primary/50 hover:bg-ink-primary/10 transition-colors">✕</button>
          </div>
          
          <div className="flex flex-col gap-8 text-left pb-12">
             <div className="flex flex-col gap-2">
                <h4 className="font-display font-bold text-xl uppercase tracking-widest text-accent-truth">1. The Setup</h4>
                <p className="font-body text-ink-primary/80 leading-relaxed font-medium">Handsy is a couch-party game. One person hosts the room on a big screen (TV, Laptop, or Tablet). Everyone else joins on their phones to use as controllers. The TV is the center of attention.</p>
             </div>
             
             <div className="flex flex-col gap-2">
                <h4 className="font-display font-bold text-xl uppercase tracking-widest text-accent-consensus">2. Power Drops</h4>
                <p className="font-body text-ink-primary/80 leading-relaxed font-medium">Every time a new card is drawn, there is a random chance for a hidden Power to drop. Keep an eye out for loot popups on your phone!</p>
             </div>
             
             <div className="flex flex-col gap-4">
                <h4 className="font-display font-bold text-xl uppercase tracking-widest text-accent-dare">3. Using Powers</h4>
                
                <div className="bg-canvas border-2 border-ink-primary/10 rounded-2xl p-5 flex flex-col gap-1">
                   <h5 className="font-display font-black text-lg text-ink-primary">🔄 DEFLECT</h5>
                   <p className="font-body text-ink-primary/70 text-sm font-medium">Pass the heat to someone else! Replaces the target of a dare or physical challenge with another player of your choice.</p>
                </div>
                
                <div className="bg-canvas border-2 border-ink-primary/10 rounded-2xl p-5 flex flex-col gap-1">
                   <h5 className="font-display font-black text-lg text-ink-primary">🛑 KILLSWITCH</h5>
                   <p className="font-body text-ink-primary/70 text-sm font-medium">Not feeling the vibe? Nuke the current card immediately and force the game to draw a random replacement.</p>
                </div>
                
                <div className="bg-canvas border-2 border-ink-primary/10 rounded-2xl p-5 flex flex-col gap-1">
                   <h5 className="font-display font-black text-lg text-ink-primary">🔥 OVERRIDE</h5>
                   <p className="font-body text-ink-primary/70 text-sm font-medium">Take control of the room. Force the game into a completely new Phase (Spark, Deepen, Ignite, or Melt) instantly.</p>
                </div>
             </div>
          </div>
        </div>

      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div className="min-h-[100dvh] bg-canvas flex flex-col text-ink-primary relative">
        <GamePopup isOpen={!!popupMessage} title="Error" message={popupMessage} onConfirm={() => setPopupMessage('')} accent="wrong" />
      <UniversalHeader 
        leftNode={<button onClick={() => setStep('hero')} className="font-meta uppercase tracking-widest text-ink-primary/60 hover:text-ink-primary">← Back</button>} 
      />
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black mb-8 sm:mb-12 uppercase tracking-wide text-center">Choose your path</h2>
        
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
           
           {/* HOST SECTION */}
           <div className="flex-1 flex flex-col gap-4">
              <h3 className="font-meta uppercase tracking-widest text-ink-primary/50 font-bold text-sm mb-2 text-center md:text-left">Create a Room</h3>
              <div 
                onClick={() => { if(!isHosting) { sessionStorage.setItem('hostlessMode', 'false'); handleHost(); } }}
                className={`bg-surface-card border-4 border-accent-truth rounded-3xl p-6 flex items-center text-left ${isHosting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent-truth transition-all shadow-solid-sm active:translate-y-[2px] active:shadow-none'} group`}  tabIndex={0} 
              >
                <div className="w-14 h-14 bg-accent-truth/10 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
                  <svg className="w-7 h-7 text-accent-truth" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
                </div>
                <div>
                  <h3 className="text-xl font-display font-black mb-1">{isHosting ? 'STARTING...' : 'TV Host'}</h3>
                  <p className="font-body text-sm text-ink-primary/60 font-medium leading-snug">Cast to a big screen. TV is the source of truth.</p>
                </div>
              </div>
              
              <div 
                onClick={() => { if(!isHosting) { sessionStorage.setItem('hostlessMode', 'true'); handleHost(); } }}
                className={`bg-surface-card border-4 border-accent-dare rounded-3xl p-6 flex items-center text-left ${isHosting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent-dare transition-all shadow-solid-sm active:translate-y-[2px] active:shadow-none'} group`}  tabIndex={0} 
              >
                <div className="w-14 h-14 bg-accent-dare/10 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
                  <IconOnTheGo className="w-7 h-7 text-accent-dare" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-black mb-1">{isHosting ? 'STARTING...' : 'On The Go'}</h3>
                  <p className="font-body text-sm text-ink-primary/60 font-medium leading-snug">Host and play directly from this phone.</p>
                </div>
              </div>
           </div>

           {/* JOIN SECTION */}
           <div className="flex-1 flex flex-col gap-4">
              <h3 className="font-meta uppercase tracking-widest text-ink-primary/50 font-bold text-sm mb-2 text-center md:text-left">Join a Room</h3>
              <div 
                onClick={() => setStep('join')}
                className="flex-1 bg-surface-card border-4 border-accent-consensus rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent-consensus transition-all group shadow-solid-sm active:translate-y-[2px] active:shadow-none min-h-[160px]"  tabIndex={0} 
              >
                <div className="w-16 h-16 bg-accent-consensus/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <IconConnect className="w-8 h-8 text-accent-consensus" />
                </div>
                <h3 className="text-2xl font-display font-black mb-2">Join Game</h3>
                <p className="font-body text-sm text-ink-primary/60 font-medium px-4">Use your phone as a controller to vote and sabotage.</p>
              </div>
           </div>

        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-canvas flex flex-col text-ink-primary relative">
      <GamePopup isOpen={!!popupMessage} title="Error" message={popupMessage} onConfirm={() => setPopupMessage('')} accent="wrong" />
      <UniversalHeader 
        leftNode={<button onClick={() => setStep('setup')} className="font-meta uppercase tracking-widest text-ink-primary/60 hover:text-ink-primary">← Back</button>} 
      />
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full">
        <div className="w-full max-w-md bg-surface-card border-4 border-accent-consensus rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-center mb-6 sm:mb-8 uppercase tracking-wide">Connect Device</h2>
        <form onSubmit={handleJoin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-meta font-bold text-xs uppercase tracking-widest text-ink-primary/50">Room Code</label>
            <input 
              type="text" 
              maxLength={6}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="XXXXXX"
              className="w-full min-w-0 bg-ink-primary/5 text-ink-primary text-center text-2xl sm:text-3xl md:text-4xl tracking-[0.2em] sm:tracking-[0.25em] font-mono p-3 sm:p-4 rounded-xl border-2 border-ink-primary/10 focus:border-accent-consensus focus:bg-surface-card outline-none transition-colors uppercase"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-meta font-bold text-xs uppercase tracking-widest text-ink-primary/50">Display Name</label>
            <input 
              type="text" 
              maxLength={12}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="e.g. Maverick"
              className="w-full min-w-0 bg-ink-primary/5 text-ink-primary text-xl font-body p-4 rounded-xl border-2 border-ink-primary/10 focus:border-accent-consensus focus:bg-surface-card outline-none transition-colors"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isJoining || roomCode.length < 6 || !playerName.trim()}
            className="mt-4 w-full py-5 bg-accent-consensus text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            {isJoining ? 'Connecting...' : 'Jack In'}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

