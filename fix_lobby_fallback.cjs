const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

code = code.replace(
  "return <div className=\"p-8 text-ink-primary bg-canvas min-h-[100dvh]\">Not a host. <button onClick={() => step === 'rules' ? (intent === 'friends' ? setStep('intent') : setStep('vibe')) : (step === 'vibe' ? setStep('intent') : (step === 'intent' ? setStep('connect') : navigate('/')))}>Go back</button></div>;",
  "return <div className=\"p-8 text-ink-primary bg-canvas min-h-[100dvh]\">Not a host. <button onClick={() => navigate('/')}>Go back</button></div>;"
);

fs.writeFileSync('src/views/LobbyView.tsx', code);
