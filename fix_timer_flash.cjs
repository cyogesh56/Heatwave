const fs = require('fs');

const hookCode = `import { useState, useEffect } from 'react';

export function useSyncTimer(endsAt?: number | null) {
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!endsAt) return 0;
    return Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!endsAt) {
      setTimeLeft(0);
      return;
    }
    
    setTimeLeft(Math.max(0, Math.floor((endsAt - Date.now()) / 1000)));

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 200);

    return () => clearInterval(interval);
  }, [endsAt]);

  return timeLeft;
}
`;
fs.writeFileSync('src/hooks/useSyncTimer.ts', hookCode);

console.log('Timer flashing fixed.');
