const fs = require('fs');

const files = [
  'src/views/Landing.tsx',
  'src/views/LobbyView.tsx',
  'src/views/ControllerView.tsx',
  'src/views/HostView.tsx',
  'src/components/ui/ChoiceGrid.tsx',
  'src/components/ui/PowerDock.tsx',
  'src/components/ui/ThemeToggle.tsx',
  'src/components/ui/GamePopup.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf-8');

  // First, clean up any existing messy active states to normalize
  code = code.replace(/active:translate-y-\[4px\]/g, '');
  code = code.replace(/active:translate-y-\[2px\]/g, '');
  code = code.replace(/active:translate-y-1/g, '');
  code = code.replace(/active:translate-y-0\.5/g, '');
  code = code.replace(/active:translate-y-0/g, '');
  code = code.replace(/active:shadow-none/g, '');
  
  // Clean up double spaces left behind
  code = code.replace(/\s+/g, ' ');

  const lines = code.split('>');
  const newLines = lines.map(line => {
    // Only modify if it's an interactive element
    if (line.includes('<button') || line.includes('cursor-pointer') || line.includes('onClick')) {
      if (line.includes('shadow-solid-sm')) {
        return line.replace('shadow-solid-sm', 'shadow-solid-sm active:translate-y-[2px] active:shadow-none');
      } else if (line.includes('shadow-solid')) {
        return line.replace('shadow-solid', 'shadow-solid active:translate-y-[4px] active:shadow-none');
      }
    }
    return line;
  });

  // Re-join and fix the tag ends that we split by
  code = newLines.join('>');

  fs.writeFileSync(file, code);
});
