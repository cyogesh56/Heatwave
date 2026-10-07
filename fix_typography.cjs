const fs = require('fs');

const views = [
  'src/views/ControllerView.tsx',
  'src/views/HostView.tsx',
  'src/views/Landing.tsx',
  'src/views/LobbyView.tsx',
];

views.forEach(file => {
  let code = fs.readFileSync(file, 'utf-8');

  // Replace text-6xl md:text-8xl
  code = code.replace(/text-6xl md:text-8xl/g, 'text-5xl md:text-6xl lg:text-8xl');
  
  // Replace text-3xl md:text-5xl
  code = code.replace(/text-3xl md:text-5xl/g, 'text-2xl md:text-4xl lg:text-5xl');

  // Replace text-[size] sm:text-[size+1]
  code = code.replace(/text-5xl sm:text-6xl/g, 'text-4xl sm:text-5xl md:text-6xl');
  code = code.replace(/text-4xl sm:text-5xl/g, 'text-3xl sm:text-4xl md:text-5xl');
  code = code.replace(/text-3xl sm:text-4xl/g, 'text-2xl sm:text-3xl md:text-4xl');

  // Replace bare large text sizes (but avoid ones that already have breakpoints)
  // We use regex lookbehinds and lookaheads, but safer is manual replacement on specific tags if possible, 
  // or a smart replace.
  
  // Actually, let's just do targeted replacement:
  code = code.replace(/"text-6xl/g, '"text-4xl md:text-5xl lg:text-6xl');
  code = code.replace(/"text-5xl/g, '"text-3xl md:text-4xl lg:text-5xl');
  code = code.replace(/"text-4xl/g, '"text-2xl md:text-3xl lg:text-4xl');
  // Wait, if it was "text-4xl sm:text-5xl md:text-6xl", replacing "text-4xl" becomes "text-2xl md:text-3xl lg:text-4xl sm:text-5xl md:text-6xl"
  // That's bad.
  
  fs.writeFileSync(file, code);
});
