const fs = require('fs');

let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

const anchor = `{/* CONTEXT AREA (No more broken card, just clear text) */}`;

const inject = `
      {/* PERSONAL UI ALERT */}
      {clientState?.players?.[clientNode?.['playerId'] || '']?.uiAlert && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-ink-primary/80 backdrop-blur-sm px-6">
           <div className="w-full bg-ink-primary text-canvas border-4 border-accent-dare rounded-3xl p-8 shadow-2xl animate-pulse text-center">
              <h3 className="text-2xl font-display font-black uppercase tracking-widest leading-tight">
                {clientState.players[clientNode['playerId']].uiAlert}
              </h3>
           </div>
        </div>
      )}
`;

cv = cv.replace(anchor, inject + '\n      ' + anchor);

fs.writeFileSync('src/views/ControllerView.tsx', cv);

console.log('Client alert added');
