const fs = require('fs');
let code = fs.readFileSync('src/views/Landing.tsx', 'utf-8');

code = code.replace(
  /  if \(step === 'setup'\) \{\n    return \(\n      <div className="min-h-\[100dvh\] bg-canvas flex flex-col text-ink-primary relative">/,
  `  if (step === 'setup') {\n    return (\n      <div className="min-h-[100dvh] bg-canvas flex flex-col text-ink-primary relative">\n        <GamePopup isOpen={!!popupMessage} title="Error" message={popupMessage} onConfirm={() => setPopupMessage('')} accent="wrong" />`
);

fs.writeFileSync('src/views/Landing.tsx', code);
