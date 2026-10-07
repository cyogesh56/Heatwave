const fs = require('fs');

const views = [
  'src/views/ControllerView.tsx',
  'src/views/HostView.tsx',
  'src/views/Landing.tsx',
  'src/views/LobbyView.tsx',
];

views.forEach(file => {
  let code = fs.readFileSync(file, 'utf-8');

  // Exact string replacements for complex classes
  code = code.replace(/text-6xl md:text-8xl/g, 'text-4xl md:text-6xl lg:text-8xl');
  code = code.replace(/text-3xl md:text-5xl/g, 'text-xl md:text-3xl lg:text-5xl');
  code = code.replace(/text-5xl sm:text-6xl/g, 'text-4xl sm:text-5xl lg:text-6xl');
  code = code.replace(/text-4xl sm:text-5xl/g, 'text-3xl sm:text-4xl lg:text-5xl');
  code = code.replace(/text-3xl sm:text-4xl/g, 'text-2xl sm:text-3xl lg:text-4xl');

  // For bare classes, we need to ensure they aren't preceded by 'sm:', 'md:', or 'lg:', and aren't followed by another text- class
  // Wait, if it's `<h1 className="text-6xl font-display...` it's easy.
  // Let's just manually replace known lines:
  
  // HostView.tsx bare classes:
  code = code.replace(/"text-6xl font-display/g, '"text-4xl md:text-5xl lg:text-6xl font-display');
  code = code.replace(/text-5xl font-black/g, 'text-3xl md:text-4xl lg:text-5xl font-black');
  code = code.replace(/text-6xl font-display font-black tabular-nums/g, 'text-4xl md:text-5xl lg:text-6xl font-display font-black tabular-nums');
  
  // ControllerView.tsx
  code = code.replace(/text-4xl font-display/g, 'text-2xl md:text-3xl lg:text-4xl font-display');
  code = code.replace(/text-3xl font-display/g, 'text-xl md:text-2xl lg:text-3xl font-display');

  // Landing.tsx
  code = code.replace(/text-6xl sm:text-8xl/g, 'text-4xl sm:text-6xl lg:text-8xl');

  fs.writeFileSync(file, code);
});
