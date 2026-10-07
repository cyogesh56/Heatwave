const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

const target = `  React.useEffect(() => {
    // Attempt to init audio context early
    const initAudio = () => soundEngine.init();
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);`;

const insert = `  React.useEffect(() => {
    // Attempt to init audio context early
    const initAudio = () => soundEngine.init();
    window.addEventListener('click', initAudio, { once: true });
    
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && hostServer) {
         console.log("Host window visible, forcing reconnect...");
         hostServer.reconnect();
         setTimeout(() => {
            if (hostGameStateRef.current) {
               hostServer.broadcast(hostGameStateRef.current);
            }
         }, 500);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    
    return () => {
      window.removeEventListener('click', initAudio);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [hostServer]);`;

code = code.replace(target, insert);

fs.writeFileSync('src/views/HostView.tsx', code);
