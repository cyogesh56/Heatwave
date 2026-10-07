const fs = require('fs');

const views = [
  'src/views/ControllerView.tsx',
  'src/views/HostView.tsx',
  'src/views/Landing.tsx',
  'src/views/LobbyView.tsx',
];

const replacements = {
  // Safe exact combinations
  'text-6xl md:text-8xl': 'text-4xl md:text-6xl lg:text-8xl',
  'text-3xl md:text-5xl': 'text-xl md:text-3xl lg:text-5xl',
  'text-6xl sm:text-8xl': 'text-4xl sm:text-6xl lg:text-8xl',
  'text-5xl sm:text-6xl': 'text-4xl sm:text-5xl md:text-6xl',
  'text-4xl sm:text-5xl': 'text-3xl sm:text-4xl md:text-5xl',
  'text-3xl sm:text-4xl': 'text-2xl sm:text-3xl md:text-4xl',
  
  // Specific bare strings with their trailing classes to prevent partial matching
  '"text-6xl font-display': '"text-4xl md:text-5xl lg:text-6xl font-display',
  'text-5xl font-black': 'text-3xl md:text-4xl lg:text-5xl font-black',
  'text-6xl font-display font-black tabular-nums': 'text-4xl md:text-5xl lg:text-6xl font-display font-black tabular-nums',
  'text-4xl font-display': 'text-2xl md:text-3xl lg:text-4xl font-display',
  'text-3xl font-display': 'text-xl md:text-2xl lg:text-3xl font-display'
};

views.forEach(file => {
  let code = fs.readFileSync(file, 'utf-8');

  // Do replacements in a single pass using a regex map, or just sequence them carefully
  // Wait, if we sequence them, 'text-4xl sm:text-5xl' -> 'text-3xl sm:text-4xl md:text-5xl'
  // Then the NEXT rule 'text-3xl sm:text-4xl' will hit it!
  // So we must use a single regex with a replacer function!
  
  const pattern = new RegExp(Object.keys(replacements).join('|'), 'g');
  code = code.replace(pattern, matched => replacements[matched]);

  fs.writeFileSync(file, code);
});
