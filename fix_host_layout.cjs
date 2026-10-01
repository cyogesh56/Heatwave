const fs = require('fs');

let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

// Replace main container
const oldMain = `<main className="flex-1 flex flex-col items-center justify-center p-8 relative z-0">
        <div className="relative w-[65vw] max-w-3xl aspect-[3/4] sm:aspect-[16/10] md:aspect-[2.5/3.5] flex items-center justify-center">`;

const newMain = `<main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-8 lg:gap-16 relative z-0 w-full max-w-[1600px] mx-auto overflow-hidden">
        {/* Left Side: Card */}
        <div className="relative w-full lg:w-1/2 flex items-center justify-center shrink-0">
          <div className="w-full max-w-md lg:max-w-xl aspect-[4/3] lg:aspect-square relative">`;

hv = hv.replace(oldMain, newMain);

// Replace renderRevealArea wrapper
const oldReveal = `{renderRevealArea()}
      </main>`;
const newReveal = `</div>
        {/* Right Side: Reveal Area */}
        <div className="w-full lg:w-1/2 flex items-center justify-center shrink-0 max-h-[40vh] lg:max-h-none overflow-y-auto pr-2">
          {renderRevealArea()}
        </div>
      </main>`;

hv = hv.replace(oldReveal, newReveal);

// Remove the hardcoded mt-16 from the reveal areas
hv = hv.replace(/mt-16/g, 'mt-0');

fs.writeFileSync('src/views/HostView.tsx', hv);

// PlayingCard font fix
let pc = fs.readFileSync('src/components/ui/PlayingCard.tsx', 'utf8');
pc = pc.replace(/text-3xl md:text-5xl/g, 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl');
fs.writeFileSync('src/components/ui/PlayingCard.tsx', pc);

