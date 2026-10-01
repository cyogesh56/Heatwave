const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

// Remove centerNode from UniversalHeader
code = code.replace(
  /\s*centerNode=\{<h1 className="text-xl sm:text-2xl font-display font-black uppercase tracking-widest hidden sm:block">Handsy Setup<\/h1>\}/g,
  ''
);

// Inject the title directly below UniversalHeader, centered
code = code.replace(
  /<div className="flex-1 w-full flex flex-col p-6 lg:p-8 overflow-y-auto">/g,
  `<div className="flex-1 w-full flex flex-col p-6 lg:p-8 overflow-y-auto">
        <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-widest text-center mb-8">Handsy Setup</h1>`
);

fs.writeFileSync('src/views/LobbyView.tsx', code);
