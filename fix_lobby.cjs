const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

code = code.replace(
  /import \{ UniversalHeader \} from '\.\.\/components\/ui\/UniversalHeader';/,
  `import { UniversalHeader } from '../components/ui/UniversalHeader';\nimport { GamePopup } from '../components/ui/GamePopup';`
);

code = code.replace(
  /const \[step, setStep\] = useState<'connect' \| 'decks' \| 'rules'>\('connect'\);/,
  `const [step, setStep] = useState<'connect' | 'decks' | 'rules'>('connect');\n  const [popupMessage, setPopupMessage] = useState('');`
);

code = code.replace(
  /alert\("No cards found for the selected decks! Please select different decks\."\);/,
  `setPopupMessage("No cards found for the selected decks! Please select different decks.");`
);

code = code.replace(
  /<div className="min-h-\[100dvh\] bg-canvas transition-colors duration-700 flex flex-col text-ink-primary relative overflow-hidden">/,
  `<div className="min-h-[100dvh] bg-canvas transition-colors duration-700 flex flex-col text-ink-primary relative overflow-hidden">\n      <GamePopup isOpen={!!popupMessage} title="Empty Deck" message={popupMessage} onConfirm={() => setPopupMessage('')} accent="wrong" />`
);

fs.writeFileSync('src/views/LobbyView.tsx', code);
