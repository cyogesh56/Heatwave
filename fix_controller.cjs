const fs = require('fs');

let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

// Add import
code = code.replace(
  /import \{ UniversalHeader \} from '\.\.\/components\/ui\/UniversalHeader';/,
  `import { UniversalHeader } from '../components/ui/UniversalHeader';\nimport { GamePopup } from '../components/ui/GamePopup';`
);

// Add state
code = code.replace(
  /const \[selectedChoice, setSelectedChoice\] = useState<string \| null>\(null\);/,
  `const [selectedChoice, setSelectedChoice] = useState<string | null>(null);\n  const [popupMessage, setPopupMessage] = useState('');`
);

// Replace alert
code = code.replace(
  /alert\("Session expired or host disconnected\."\);\n        localStorage\.removeItem\('handsy_room'\);\n        localStorage\.removeItem\('handsy_name'\);\n        window\.location\.href = '\/';/,
  `setPopupMessage("Session expired or host disconnected.");`
);

// Add popup to render
code = code.replace(
  /<div className="relative w-full h-\[100dvh\] bg-canvas flex flex-col overflow-hidden text-ink-primary font-sans">/,
  `<div className="relative w-full h-[100dvh] bg-canvas flex flex-col overflow-hidden text-ink-primary font-sans">\n      <GamePopup isOpen={!!popupMessage} title="Disconnected" message={popupMessage} onConfirm={() => { localStorage.removeItem('handsy_room'); localStorage.removeItem('handsy_name'); window.location.href = '/'; }} accent="dare" />`
);

fs.writeFileSync('src/views/ControllerView.tsx', code);
