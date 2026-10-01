const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

if (!code.includes("import { soundEngine }")) {
  code = code.replace(
    "import { TimerBadge } from '../components/ui/TimerBadge';",
    "import { TimerBadge } from '../components/ui/TimerBadge';\nimport { soundEngine } from '../lib/audio/SoundEngine';"
  );
}

// Add audio initialization on mount or click
code = code.replace(
  /const timeLeft = useSyncTimer\(hostGameState\?\.timers\?\.endsAt\);/,
  `const timeLeft = useSyncTimer(hostGameState?.timers?.endsAt);
  
  React.useEffect(() => {
    // Attempt to init audio context early
    const initAudio = () => soundEngine.init();
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);`
);

// Play thud on card change
code = code.replace(
  /const parsedPrompt = hostGameState\?\.currentCard\?\.parsedPrompt \|\| '';/,
  `const parsedPrompt = hostGameState?.currentCard?.parsedPrompt || '';
  
  React.useEffect(() => {
    if (parsedPrompt) soundEngine.playThud();
  }, [parsedPrompt]);`
);

// Play tick when timer < 5
code = code.replace(
  /const percentage = \(\(timeLeft \|\| 0\) \/ 30\) \* 100;/,
  `const percentage = ((timeLeft || 0) / 30) * 100;
  
  React.useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && timeLeft <= 5) {
      soundEngine.playTick();
    }
  }, [timeLeft]);`
);

fs.writeFileSync('src/views/HostView.tsx', code);
