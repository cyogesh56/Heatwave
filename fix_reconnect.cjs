const fs = require('fs');
let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

const reconnectLogic = `
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const savedRoom = localStorage.getItem('handsy_room');
        const savedName = localStorage.getItem('handsy_name');
        if (savedRoom && savedName) {
           console.log('App became visible. Forcing reconnect...');
           if (clientNode) {
             clientNode.destroy();
           }
           initClient(savedRoom, savedName).catch(console.error);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initial mount check
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
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clientState, clientNode, initClient]);
`;

// Replace the existing useEffect
code = code.replace(/React\.useEffect\(\(\) => \{\n\s+if \(!clientState && !clientNode\) \{[\s\S]*?window\.location\.href = '\/';\n\s+\}\n\s+\}\n\s+\}, \[clientState, clientNode, initClient\]\);/m, reconnectLogic);

fs.writeFileSync('src/views/ControllerView.tsx', code);
