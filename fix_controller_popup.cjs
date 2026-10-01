const fs = require('fs');
let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

code = code.replace(
  /  if \(!clientState \|\| !clientState\.currentCard\) \{\n    const isReconnecting = !clientNode;\n    return \(\n      <div className="min-h-\[100dvh\] bg-canvas text-ink-primary flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">/,
  `  if (!clientState || !clientState.currentCard) {\n    const isReconnecting = !clientNode;\n    return (\n      <div className="min-h-[100dvh] bg-canvas text-ink-primary flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">\n        <GamePopup isOpen={!!popupMessage} title="Disconnected" message={popupMessage} onConfirm={() => { localStorage.removeItem('handsy_room'); localStorage.removeItem('handsy_name'); window.location.href = '/'; }} accent="dare" />`
);

fs.writeFileSync('src/views/ControllerView.tsx', code);
