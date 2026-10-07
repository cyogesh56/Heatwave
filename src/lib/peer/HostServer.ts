import { supabase } from '../supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export type GameState = {
  phase: number;
  currentCard: { card: any, parsedPrompt: string, targetedPlayers?: string[], assignedResponderName?: string } | null;
  players: Record<string, { name: string, isReady: boolean, inventory: { deflect: number, killswitch: number, override: number }, isConnected?: boolean, uiAlert?: string }>;
  timers: {
    active: boolean;
    remainingSeconds: number;
    endsAt?: number | null;
  };
  uiState: 'waiting' | 'voting' | 'ready_check' | 'dare_active' | 'interstitial' | 'ended' | 'superlatives';
  settings?: { chaosMode: boolean; chillMode: boolean };
  stats?: Record<string, { powersUsed: number; truthsAnswered: number; daresCompleted: number; targetedCount: number }>;
  interstitial?: { title: string, subtitle: string, color?: string, icon?: string };
  uiAlert?: string;
  theme?: 'light' | 'dark';
  readyPlayers?: string[];
  juryState?: { active: boolean; targetId: string; votes: Record<string, 'yes'|'no'> };
  revealCountdown?: number | null;
};

export class HostServer {
  public roomCode: string = '';
  private channel: RealtimeChannel | null = null;
  private onPlayerAction: (playerId: string, action: any) => void;

  constructor(
    onStateChange: (state: Partial<GameState>) => void,
    onPlayerAction: (playerId: string, action: any) => void
  ) {
    this.onPlayerAction = onPlayerAction;
  }

  public init() {
    return new Promise<string>((resolve, reject) => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let code = ""; for(let i=0; i<6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length)); this.roomCode = code;
      
      this.channel = supabase.channel(`room-${this.roomCode}`, { config: { broadcast: { self: true }, presence: { key: 'host' } } });

      this.channel
        .on('presence', { event: 'sync' }, () => {
          const state = this.channel!.presenceState();
          const connectedIds = new Set<string>();
          for (const key of Object.keys(state)) {
            if (key !== 'host') {
              state[key].forEach((p: any) => {
                if (p.playerId) connectedIds.add(p.playerId);
              });
            }
          }
          window.dispatchEvent(new CustomEvent('presence-sync', { detail: { connectedIds: Array.from(connectedIds) } }));
        })
        .on('broadcast', { event: 'client-action' }, (payload) => {
          this.onPlayerAction(payload.payload.playerId, payload.payload.action);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Host channel ready:', this.roomCode);
            resolve(this.roomCode);
          }
          if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            reject(new Error('Channel error: ' + status));
          }
        });
    });
  }

  public broadcast(state: any) {
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'host-state',
        payload: state
      });
    }
  }

  public destroy() {
    this.channel?.unsubscribe();
  }
}
