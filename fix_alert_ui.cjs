const fs = require('fs');

let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

const oldRender = `    if (uiAlert) {
      return (
        <div className="w-full max-w-4xl mt-0 bg-ink-primary/90 backdrop-blur-3xl rounded-3xl p-8 border border-accent-dare shadow-2xl animate-pulse">
           <h3 className="text-3xl font-display font-black text-center text-canvas">{uiAlert}</h3>
        </div>
      );
    }`;

const newRender = `    if (uiAlert) {
      return (
        <div className="w-full max-w-4xl mt-0 bg-ink-primary text-canvas backdrop-blur-3xl rounded-3xl p-8 border-4 border-accent-dare shadow-2xl animate-pulse">
           <h3 className="text-3xl font-display font-black text-center">{uiAlert}</h3>
        </div>
      );
    }`;

hv = hv.replace(oldRender, newRender);
fs.writeFileSync('src/views/HostView.tsx', hv);

console.log('UI fixed');
