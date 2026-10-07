const fs = require('fs');
let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

code = code.replace(
  /<GamePopup isOpen=\{\!\!popupMessage\} title="Disconnected" message=\{popupMessage\} onConfirm=\{\(\) => \{ localStorage.removeItem\('handsy_room'\); localStorage.removeItem\('handsy_name'\); window.location.href = '\/'; \}\} accent="dare" \/>/g,
  `<GamePopup isOpen={!!popupMessage} title="Disconnected" message={popupMessage} confirmText="Return to Lobby" onConfirm={() => { localStorage.removeItem('handsy_room'); localStorage.removeItem('handsy_name'); window.location.href = '/'; }} accent="dare" />`
);

fs.writeFileSync('src/views/ControllerView.tsx', code);
