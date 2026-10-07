import { jsx as _jsx } from "react/jsx-runtime";
import { supabase } from '../lib/supabase';
import { createContext, useContext, useState } from 'react';
import { HostServer } from '../lib/peer/HostServer';
import { ClientNode } from '../lib/peer/ClientNode';
import { GameEngine } from '../lib/engine/stateMachine';
const GameContext = createContext(undefined);
export const GameProvider = ({ children }) => {
    const [hostServer, setHostServer] = useState(null);
    const [clientNode, setClientNode] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [gameEngine, setGameEngine] = useState(null);
    const [hostGameState, setHostGameState] = useState(null);
    const [clientState, setClientState] = useState(null);
    const initHost = async () => {
        setIsHost(true);
        const server = new HostServer((stateUpdate) => {
            setHostGameState((prev) => prev ? { ...prev, ...stateUpdate } : stateUpdate);
        }, (playerId, action) => {
            // We will process actions in a useEffect inside HostView or through an event emitter
            // For simplicity, we can emit a custom event on the window or handle it here
            if (action.type === 'join') {
                setHostGameState(prev => {
                    if (!prev)
                        return prev;
                    // Block new players mid-game, but allow reconnects
                    if (prev.uiState !== 'waiting' && !prev.players[playerId])
                        return prev;
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
            }
            else if (action.type === 'disconnect') {
                setHostGameState(prev => {
                    if (!prev)
                        return prev;
                    if (prev.uiState === 'waiting') {
                        const newPlayers = { ...prev.players };
                        delete newPlayers[playerId];
                        const stats = { ...(prev.stats || {}) };
                        if (!stats[playerId])
                            stats[playerId] = { powersUsed: 0, truthsAnswered: 0, daresCompleted: 0, targetedCount: 0 };
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
            }
            else {
                if (action.type === 'power') {
                    setHostGameState(prev => {
                        if (!prev)
                            return prev;
                        const player = prev.players[playerId];
                        const basePower = action.power.split('_')[0];
                        if (!player || player.inventory[basePower] <= 0)
                            return prev;
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
        });
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
    const initClient = async (roomCode, playerName) => {
        if (sessionStorage.getItem('hostlessMode') !== 'true')
            setIsHost(false);
        const client = new ClientNode((data) => setClientState(data), () => {
            console.log('Disconnected');
            setClientState(null);
        });
        if (hostServer) {
            // Local Host bypass: Add directly to host state to skip network latency
            setHostGameState(prev => {
                if (!prev)
                    return prev;
                const nextState = {
                    ...prev,
                    players: {
                        ...prev.players,
                        ['host']: { name: playerName, isReady: false, inventory: { deflect: 0, killswitch: 0, override: 0 }, isConnected: true }
                    }
                };
                setTimeout(() => hostServer.broadcast(nextState), 50);
                return nextState;
            });
            // Override connectToHost to resolve instantly since we injected state
            client.connectToHost = async () => {
                client['playerId'] = 'host';
                client['playerName'] = playerName;
                // We simulate the exact subscription the ClientNode needs
                client['channel'] = supabase.channel(`room-${roomCode}`);
                client['channel'].on('broadcast', { event: 'host-state' }, (payload) => {
                    client['onHostData'](payload.payload);
                }).subscribe();
            };
        }
        await client.connectToHost(roomCode, playerName);
        setClientNode(client);
    };
    const startGame = (cards) => {
        setGameEngine(new GameEngine(cards));
    };
    return (_jsx(GameContext.Provider, { value: {
            hostServer, clientNode, isHost,
            gameEngine, hostGameState, setHostGameState,
            clientState, setClientState,
            initHost, initClient, startGame
        }, children: children }));
};
export const useGame = () => {
    const context = useContext(GameContext);
    if (!context)
        throw new Error("useGame must be used within GameProvider");
    return context;
};
