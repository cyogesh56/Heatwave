import re

with open("src/views/HostView.tsx", "r") as f:
    content = f.read()

# Replace renderRevealArea
def replace_reveal_area():
    global content
    start = content.find("const renderRevealArea = () => {")
    if start == -1: return False
    
    end = content.find("return (\n  <ErrorBoundary>", start)
    if end == -1: return False

    new_reveal = """const renderRevealArea = () => {
    if (!['kahoot', 'wrong_answers', 'consensus', 'vibe_poll', 'fill_blank'].includes(card.type)) {
      return null;
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
            <div className="font-meta font-bold text-accent-dare text-xl sm:text-2xl tracking-widest animate-pulse">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          {options.map((opt: string, i: number) => {
            const count = Object.values(votes).filter(v => v === opt).length;
            const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            
            return (
              <div key={i} className="flex items-center gap-3 sm:gap-6">
                <div className="w-16 sm:w-24 shrink-0 font-display font-bold text-xs sm:text-base uppercase tracking-widest text-ink-primary/60 text-right truncate">
                  {opt}
                </div>
                <div className="flex-1 h-6 sm:h-8 bg-ink-primary/5 rounded-full overflow-hidden relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-accent-consensus transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center px-4">
                    <span className="font-meta text-xs font-bold text-canvas mix-blend-difference">{count} votes</span>
                  </div>
                </div>
                <div className="w-16 font-meta text-xl text-accent-consensus">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  """
    content = content[:start] + new_reveal + content[end:]
    return True

replace_reveal_area()

# Now patch the main UI
start_idx = content.find('<div className="flex flex-col lg:flex-row items-center justify-center w-full gap-4 sm:gap-8 lg:gap-16">')
if start_idx == -1:
    print("Could not find start idx for main layout")
    exit(1)

end_idx = content.find('</main>')
if end_idx == -1:
    print("Could not find end idx")
    exit(1)

main_layout = """<div className="flex flex-col items-center justify-start w-full max-w-xl gap-4 sm:gap-6 mt-4">
            {/* Top Side: Card */}
            <div className={`relative w-full flex items-center justify-center shrink-0`}>
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
                    index={card.phase}
                  />
                </motion.div>
              </AnimatePresence>
              </div>
            </div>
            
            {/* TV Toggle (Only for Vote-based cards) */}
            {['kahoot', 'wrong_answers', 'consensus', 'vibe_poll', 'fill_blank'].includes(card.type) && (
              <div className="flex bg-surface-card border-2 border-ink-primary/20 rounded-full p-1 my-2 w-full max-w-sm shrink-0">
                <button onClick={() => setShowMobileResults(false)} className={`flex-1 py-2 rounded-full font-bold uppercase tracking-widest text-xs transition-colors ${!showMobileResults ? 'bg-ink-primary text-canvas shadow-md' : 'text-ink-primary/50'}`}>Question</button>
                <button onClick={() => setShowMobileResults(true)} className={`flex-1 py-2 rounded-full font-bold uppercase tracking-widest text-xs transition-colors ${showMobileResults ? 'bg-ink-primary text-canvas shadow-md' : 'text-ink-primary/50'}`}>Votes</button>
              </div>
            )}

            {/* Reveal Area */}
            {['kahoot', 'wrong_answers', 'consensus', 'vibe_poll', 'fill_blank'].includes(card.type) && showMobileResults && (
              <div className="w-full flex items-center justify-center shrink-0 min-h-[100px]">
                {renderRevealArea()}
              </div>
            )}
            
            {/* Global Force Advance / Draw Next Card */}
            <div className="w-full max-w-sm mt-2 shrink-0">
               {['kahoot', 'wrong_answers', 'consensus', 'vibe_poll', 'fill_blank'].includes(card.type) ? (
                 <button onClick={() => handleNextCard(false)} className="w-full py-4 bg-accent-dare text-canvas font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-solid active:translate-y-[4px] active:shadow-none transition-all">
                   Draw Next Card
                 </button>
               ) : (
                 <>
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
                     <button onClick={() => window.dispatchEvent(new CustomEvent('player-action', { detail: { playerId: 'host', action: { type: 'fail_truth' } } }))} className="mt-4 w-full py-4 bg-transparent border-4 border-accent-truth text-accent-truth font-display font-black text-xl uppercase tracking-widest rounded-2xl hover:bg-accent-truth/10 transition-all">
                       Answer a Truth Instead
                     </button>
                   )}
                 </>
               )}
            </div>
          </div>
        )}
      """

content = content[:start_idx] + main_layout + content[end_idx:]

with open("src/views/HostView.tsx", "w") as f:
    f.write(content)

