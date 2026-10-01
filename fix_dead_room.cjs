const fs = require('fs');

let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf8');

const newEffect = `  // Dead Room Detector: If connected to channel but host never sends state
  React.useEffect(() => {
    let timeout: number;
    if (clientNode && !clientState) {
      timeout = window.setTimeout(() => {
        alert("Session expired or host disconnected.");
        localStorage.removeItem('handsy_room');
        localStorage.removeItem('handsy_name');
        window.location.href = '/';
      }, 7000); // 7 seconds grace period
    }
    return () => clearTimeout(timeout);
  }, [clientNode, clientState]);

`;

// Find where to insert it. Just before the setSelectedChoice effect.
const hookPoint = `  React.useEffect(() => {
    setSelectedChoice(null);`;

cv = cv.replace(hookPoint, newEffect + hookPoint);
fs.writeFileSync('src/views/ControllerView.tsx', cv);
console.log('Dead room detector added');
