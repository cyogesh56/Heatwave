const fs = require('fs');
let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

const oldLogic = `{clientState.currentCard.assignedResponderName ? (clientState.currentCard.assignedResponderName === clientNode?.['playerName'] ? 'Cast Your Vote' : 'Waiting for Answer') : 'Cast Your Vote'}
              </span>
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
            </div>
            {clientState.currentCard.assignedResponderName && clientState.currentCard.assignedResponderName !== clientNode?.['playerName'] ? (
              <div className="w-full py-12 text-center text-2xl md:text-3xl lg:text-4xl font-display font-black text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
                WAITING
              </div>
            ) : selectedChoice ?`;

const newLogic = `{clientState.currentCard.assignedResponderName ? (clientState.currentCard.assignedResponderName === clientNode?.['playerName'] ? 'Guess Out Loud!' : 'Cast Your Vote') : 'Cast Your Vote'}
              </span>
              <div className="h-0.5 flex-1 bg-ink-primary/10"></div>
            </div>
            {clientState.currentCard.assignedResponderName && clientState.currentCard.assignedResponderName === clientNode?.['playerName'] ? (
              <div className="w-full py-12 text-center text-2xl md:text-3xl lg:text-4xl font-display font-black text-ink-primary/50 animate-pulse uppercase tracking-widest border-4 border-dashed border-ink-primary/20 rounded-3xl">
                GUESS OUT LOUD
              </div>
            ) : selectedChoice ?`;

code = code.replace(oldLogic, newLogic);

fs.writeFileSync('src/views/ControllerView.tsx', code);
