const fs = require('fs');

let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

const actionZoneStart = `{/* ACTION ZONE (Massive target, clear hierarchy) */}`;
const powerDockStart = `{/* POWER DOCK */}`;

const cvParts = cv.split(actionZoneStart);
const cvParts2 = cvParts[1].split(powerDockStart);

const newActionZone = `
      <section className="flex-1 w-full max-w-xl mx-auto flex flex-col items-center justify-center p-6 gap-6 relative z-0">
        {clientState?.timers?.active && timeLeft > 0 && (
          <div className="absolute top-0 right-6 font-meta font-bold text-2xl text-ink-primary/50 animate-pulse">
             00:{timeLeft.toString().padStart(2, '0')}
          </div>
        )}
        
        {/* TIME UP STATE */}
        {clientState?.timers?.active && timeLeft <= 0 && !selectedChoice ? (
           <div className="w-full py-12 text-center text-4xl font-display font-black text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
             TIME UP
           </div>
        ) : questionType === 'wrong' || questionType === 'wrong_answers' || questionType === 'consensus' || questionType === 'vibe_poll' || questionType === 'kahoot' ? (
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex items-center gap-4">
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
              <span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">Cast Your Vote</span>
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
            </div>
            {selectedChoice ? (
              <div className="w-full py-12 text-center text-4xl font-display font-black text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
                VOTED
              </div>
            ) : (
              <ChoiceGrid 
                choices={card.options || ['A', 'B', 'C', 'D']} 
                selectedChoice={selectedChoice}
                onSelect={handleVote}
                accent={questionType === 'consensus' ? 'consensus' : 'wrong'}
              />
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            {questionType === 'dare' ? (
              <>
                <div className="w-full flex items-center gap-4">
                  <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
                  <span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">Your Challenge</span>
                  <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
                </div>
                <button 
                  onClick={() => handleVote('done')}
                  disabled={selectedChoice !== null}
                  className="w-full py-8 rounded-2xl bg-accent-dare border-4 border-ink-primary text-canvas font-display font-black text-3xl uppercase tracking-widest shadow-solid active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
                >
                  {selectedChoice ? 'WAITING...' : 'I DID IT'}
                </button>
              </>
            ) : (
              <>
                <div className="w-full flex items-center gap-4 opacity-50">
                  <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
                  <span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">Room Discussion</span>
                  <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
                </div>
                <button 
                  onClick={() => handleVote('done')}
                  disabled={selectedChoice !== null}
                  className="mt-8 w-full py-4 rounded-2xl border-4 border-ink-primary/20 bg-transparent text-ink-primary/60 font-display font-bold text-xl uppercase tracking-widest hover:bg-ink-primary/5 active:bg-ink-primary/10 transition-all disabled:opacity-50"
                >
                  {selectedChoice ? 'WAITING...' : 'ACTIVITY COMPLETED'}
                </button>
              </>
            )}
            
            {/* ANSWER A TRUTH INJECTION */}
            {parsedPrompt.toLowerCase().includes('answer a truth') && !selectedChoice && (
              <button 
                onClick={() => {
                  handleVote('fail_truth');
                }}
                className="mt-2 w-full py-6 rounded-2xl border-4 border-accent-truth text-accent-truth bg-canvas font-display font-black text-2xl uppercase tracking-widest active:bg-accent-truth/10 transition-all"
              >
                ANSWER A TRUTH
              </button>
            )}
          </div>
        )}
      </section>

      `;

cv = cvParts[0] + actionZoneStart + newActionZone + powerDockStart + cvParts2[1];
fs.writeFileSync('src/views/ControllerView.tsx', cv);

console.log('Action zone rewriten successfully');
