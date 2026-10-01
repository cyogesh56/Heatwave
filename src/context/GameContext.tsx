import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { HostServer, GameState as HostGameState } from '../lib/peer/HostServer';
import { ClientNode } from '../lib/peer/ClientNode';
import { GameEngine, Card } from '../lib/engine/stateMachine';

interface GameContextType {
  hostServer: HostServer | null;
  clientNode: ClientNode | null;
  isHost: boolean;
  
  // Host State
  gameEngine: GameEngine | null;
  hostGameState: HostGameState | null;
  setHostGameState: React.Dispatch<React.SetStateAction<HostGameState | null>>;
  
  // Client State
  clientState: any | null;
  setClientState: React.Dispatch<React.SetStateAction<any | null>>;

  // Actions
  initHost: () => Promise<string>;
  initClient: (roomCode: string, playerName: string) => Promise<void>;
  startGame: (cards: Card[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hostServer, setHostServer] = useState<HostServer | null>(null);
  const [clientNode, setClientNode] = useState<ClientNode | null>(null);
  const [isHost, setIsHost] = useState(false);
  
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [hostGameState, setHostGameState] = useState<HostGameState | null>(null);
  const [clientState, setClientState] = useState<any | null>(null);

  const initHost = async () => {
    setIsHost(true);
    const server = new HostServer(
      (stateUpdate) => {
        setHostGameState((prev) => prev ? { ...prev, ...stateUpdate } : stateUpdate as HostGameState);
      },
      (playerId, action) => {
        // We will process actions in a useEffect inside HostView or through an event emitter
        // For simplicity, we can emit a custom event on the window or handle it here
        
        if (action.type === 'join') {
          setHostGameState(prev => {
            if (!prev) return prev;
            // Block new players mid-game, but allow reconnects
            if (prev.uiState !== 'waiting' && !prev.players[playerId]) return prev;
            
            
            // Preserve inventory on reconnect
            const existingInv = prev.players[playerId]?.inventory || { deflect: 0, killswitch: 0, override: 0 };
            
            const nextState = {
              ...prev,
              players: {
                ...prev.players,
                [playerId]: { name: action.name, isReady: false, inventory: existingInv, isConnected: true }
              }
            };

            setTimeout(() => {
              server.broadcast(nextState);
            }, 300);
            
            return nextState;
          });
        } else if (action.type === 'disconnect') {
          setHostGameState(prev => {
            if (!prev) return prev;
            if (prev.uiState === 'waiting') {
               const newPlayers = { ...prev.players };
               delete newPlayers[playerId];
               const stats = { ...(prev.stats || {}) };
            if (!stats[playerId]) stats[playerId] = { powersUsed: 0, truthsAnswered: 0, daresCompleted: 0, targetedCount: 0 };
            return { ...prev, players: newPlayers, stats };
            }
            
            const nextState = {
               ...prev,
               players: {
                 ...prev.players,
                 [playerId]: { ...prev.players[playerId], isConnected: false }
               }
            };
            setTimeout(() => {
                server.broadcast(nextState);
            }, 100);
            return nextState;
          });
        } else {
          
          if (action.type === 'power') {
            setHostGameState(prev => {
              if (!prev) return prev;
              const player = prev.players[playerId];
              const basePower = action.power.split('_')[0] as keyof typeof player.inventory;
              
              if (!player || player.inventory[basePower] <= 0) return prev;
              
              return {
                ...prev,
                players: {
                  ...prev.players,
                  [playerId]: {
                    ...player,
                    inventory: {
                      ...player.inventory,
                      [basePower]: player.inventory[basePower] - 1
                    }
                  }
                }
              };
            });
          }
          window.dispatchEvent(new CustomEvent('player-action', { detail: { playerId, action } }));
  
        }

      }
    );
    const code = await server.init();
    setHostServer(server);
    setHostGameState({
      phase: 1,
      currentCard: null,
      players: {},
      timers: { active: false, remainingSeconds: 0 },
      uiState: 'waiting', settings: { chaosMode: false, chillMode: false }, stats: {}
    });
    return code;
  };

  const initClient = async (roomCode: string, playerName: string) => {
    setIsHost(false);
    const client = new ClientNode(
      (data) => setClientState(data),
      () => {
        console.log('Disconnected');
        setClientState(null);
      }
    );
    await client.connectToHost(roomCode, playerName);
    setClientNode(client);
  };

  const startGame = (cards: Card[]) => {
    setGameEngine(new GameEngine(cards));
  };

  return (
    <GameContext.Provider value={{
      hostServer, clientNode, isHost,
      gameEngine, hostGameState, setHostGameState,
      clientState, setClientState,
      initHost, initClient, startGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
