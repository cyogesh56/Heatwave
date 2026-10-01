const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

code = code.replace(
  /import \{ UniversalHeader \} from '\.\.\/components\/ui\/UniversalHeader';/,
  `import { UniversalHeader } from '../components/ui/UniversalHeader';\nimport { GamePopup } from '../components/ui/GamePopup';`
);

code = code.replace(
  /const \[uiAlert, setUiAlert\] = useState<string>('');/,
  `const [uiAlert, setUiAlert] = useState<string>('');\n  const [confirmEndGame, setConfirmEndGame] = useState(false);`
);

code = code.replace(
  /onClick=\{\(\) => \{\n              if \(window\.confirm\('Are you sure you want to end the game for everyone\?'\)\) \{/,
  `onClick={() => {\n              setConfirmEndGame(true);\n              /*`
);

// We need to move the block out
code = code.replace(
  /                if \(hostServer\) \{\n                  setHostGameState\(prev => \{\n                    if \(!prev\) return null; const next = \{ \.\.\.prev, uiState: 'ended' as const \};\n                    hostServer\.broadcast\(next\);\n                    return next;\n                  \}\);\n                \}\n              \}\n            \}\}/,
  `*/\n            }}`
);

code = code.replace(
  /<div className="min-h-\[100dvh\] w-full flex flex-col transition-colors duration-500 bg-canvas text-ink-primary font-sans overflow-x-hidden">/,
  `<div className="min-h-[100dvh] w-full flex flex-col transition-colors duration-500 bg-canvas text-ink-primary font-sans overflow-x-hidden">\n      <GamePopup \n        isOpen={confirmEndGame} \n        title="End Game?" \n        message="Are you sure you want to end the game for everyone?" \n        type="confirm" \n        onConfirm={() => { setConfirmEndGame(false); if (hostServer) { setHostGameState(prev => { if (!prev) return null; const next = { ...prev, uiState: 'ended' as const }; hostServer.broadcast(next); return next; }); } }}\n        onCancel={() => setConfirmEndGame(false)}\n        accent="dare" \n      />`
);


fs.writeFileSync('src/views/HostView.tsx', code);
