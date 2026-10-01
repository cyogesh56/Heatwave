const fs = require('fs');
let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

const hookStart = `export const ControllerView: React.FC = () => {
  const { clientState, clientNode, initClient } = useGame();`;

cv = cv.replace(/export const ControllerView: React\.FC = \(\) => \{\n  const \{ clientState, clientNode \} = useGame\(\);/, hookStart);

const newEffect = `
  React.useEffect(() => {
    if (!clientState && !clientNode) {
      const savedRoom = localStorage.getItem('handsy_room');
      const savedName = localStorage.getItem('handsy_name');
      if (savedRoom && savedName) {
        initClient(savedRoom, savedName).catch(() => {
           localStorage.removeItem('handsy_room');
           window.location.href = '/';
        });
      } else {
        window.location.href = '/';
      }
    }
  }, [clientState, clientNode, initClient]);
`;

cv = cv.replace(/  const timeLeft = useSyncTimer\(clientState\?\.timers\?\.endsAt\);\n/, `  const timeLeft = useSyncTimer(clientState?.timers?.endsAt);\n` + newEffect);

fs.writeFileSync('src/views/ControllerView.tsx', cv);
console.log('Added auto-reconnect');
