const players = ["Alice", "Bob"];
const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
const playerMap = {
  '[Player A]': shuffledPlayers[0],
  '[Player B]': shuffledPlayers[1],
  '[Player C]': shuffledPlayers[2],
  '[Player D]': shuffledPlayers[3]
};
console.log(playerMap);
