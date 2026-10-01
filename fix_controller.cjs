const fs = require('fs');
let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

const oldBlock = `          <div className="w-full flex flex-col gap-4">
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
          </div>`;

const newBlock = `          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex items-center gap-4">
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
              <span className="font-meta text-xs uppercase tracking-widest font-bold text-ink-primary/40">
                {card.assignedResponderName ? (card.assignedResponderName === clientNode?.['playerName'] ? 'Cast Your Vote' : 'Waiting for Answer') : 'Cast Your Vote'}
              </span>
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
            </div>
            {card.assignedResponderName && card.assignedResponderName !== clientNode?.['playerName'] ? (
              <div className="w-full py-12 text-center text-4xl font-display font-black text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
                WAITING
              </div>
            ) : selectedChoice ? (
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
          </div>`;

code = code.replace(oldBlock, newBlock);
fs.writeFileSync('src/views/ControllerView.tsx', code);
