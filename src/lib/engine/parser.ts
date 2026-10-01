export function parsePrompt(
  prompt: string,
  players: string[],
  options?: string[]
): { text: string; targetedPlayers: string[]; parsedOptions?: string[]; assignedResponderName?: string } {
  if (players.length < 2) {
    players = ["Player 1", "Player 2"];
  }

  const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
  const pA = shuffledPlayers[0];
  const pB = shuffledPlayers[1];
  const pC = shuffledPlayers[2];
  const pD = shuffledPlayers[3];

  const playerA = pA || 'Player A';
  const playerB = pB || 'Player B';
  const playerC = pC || 'someone in the room';
  const playerD = pD || 'the person to your left';

  const targetedPlayers: string[] = [];
  let assignedResponderName: string | undefined = undefined;
  const responderMatch = prompt.match(/\[(Player [A-D])\] answers\.?/i);
  if (responderMatch) {
    if (responderMatch[1].toUpperCase() === 'PLAYER A') assignedResponderName = playerA;
    else if (responderMatch[1].toUpperCase() === 'PLAYER B') assignedResponderName = playerB;
    else if (responderMatch[1].toUpperCase() === 'PLAYER C') assignedResponderName = playerC;
    else if (responderMatch[1].toUpperCase() === 'PLAYER D') assignedResponderName = playerD;
  }
  if (prompt.includes('[Player A]')) targetedPlayers.push(playerA);
  if (prompt.includes('[Player B]')) targetedPlayers.push(playerB);

  let parsedText = prompt
    .replace(/\[Player A\]/g, playerA)
    .replace(/\[Player B\]/g, playerB)
    .replace(/\[Player C\]/g, playerC)
    .replace(/\[Player D\]/g, playerD);

  parsedText = parsedText.replace(/\[([^\]]+)\]/g, (match, contents) => {
    if (contents.includes('/')) {
      const opts = contents.split('/');
      return opts[Math.floor(Math.random() * opts.length)];
    }
    return match;
  });

  let parsedOptions: string[] | undefined = undefined;
  
  if (options) {
    parsedOptions = [];
    for (const opt of options) {
      // If the option is EXACTLY a player token, and that player doesn't exist, drop it
      if (opt === '[Player C]' && !pC) continue;
      if (opt === '[Player D]' && !pD) continue;
      if (opt === '[Player A]' && !pA) continue; // Should not happen if players >= 2
      if (opt === '[Player B]' && !pB) continue; // Should not happen if players >= 2

      let parsedOpt = opt
        .replace(/\[Player A\]/g, playerA)
        .replace(/\[Player B\]/g, playerB)
        .replace(/\[Player C\]/g, playerC)
        .replace(/\[Player D\]/g, playerD);
      
      parsedOptions.push(parsedOpt);
    }
  }

  return {
    text: parsedText,
    targetedPlayers,
    parsedOptions,
    assignedResponderName
  };
}
