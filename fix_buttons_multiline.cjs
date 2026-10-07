const fs = require('fs');

const views = [
  'src/views/ControllerView.tsx',
  'src/views/HostView.tsx',
  'src/views/Landing.tsx',
  'src/views/LobbyView.tsx',
];

views.forEach(file => {
  let code = fs.readFileSync(file, 'utf-8');

  // Replace all button corners (rounded-full, rounded-3xl, rounded-xl) to rounded-2xl
  // ONLY inside <button> tags
  let newCode = '';
  let inButton = false;
  let lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.includes('<button')) inButton = true;
    
    if (inButton) {
      if (!line.includes('w-10 h-10') && !line.includes('w-14 h-14') && !line.includes('w-12 h-12')) {
        line = line.replace(/rounded-full/g, 'rounded-2xl shadow-solid-sm active:translate-y-0.5 active:shadow-none transition-all');
        line = line.replace(/rounded-3xl/g, 'rounded-2xl');
        line = line.replace(/rounded-xl/g, 'rounded-2xl');
      }
    }
    
    if (line.includes('</button>')) inButton = false;
    
    newCode += line + '\n';
  }
  
  // Cleanup any duplicated classes just in case
  newCode = newCode.replace(/shadow-solid-sm shadow-solid-sm/g, 'shadow-solid-sm');
  newCode = newCode.replace(/shadow-solid shadow-solid-sm/g, 'shadow-solid');
  newCode = newCode.replace(/transition-all transition-all/g, 'transition-all');

  fs.writeFileSync(file, newCode);
});
