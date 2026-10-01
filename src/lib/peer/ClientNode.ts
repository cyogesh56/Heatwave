import { supabase } from '../supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export class ClientNode {
  private channel: RealtimeChannel | null = null;
  public playerId: string = '';
  public playerName: string = '';
  
  private onHostData: (data: any) => void;
  private onDisconnect: () => void;

  constructor(onHostData: (data: any) => void, onDisconnect: () => void) {
    this.onHostData = onHostData;
    this.onDisconnect = onDisconnect;
  }

  public connectToHost(roomCode: string, playerName: string) {
    this.playerName = playerName;
    const savedId = localStorage.getItem(`handsy_player_${roomCode}`);
    if (savedId) {
      this.playerId = savedId;
    } else {
      this.playerId = Math.random().toString(36).substring(2, 9);
      localStorage.setItem(`handsy_player_${roomCode}`, this.playerId);
    }

    return new Promise<void>((resolve, reject) => {
      this.channel = supabase.channel(`room-${roomCode}`, { config: { presence: { key: this.playerId } } });

      let isResolved = false;
      const connectionTimeout = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          this.channel?.unsubscribe();
          reject(new Error('Invalid Room Code. Host not found.'));
        }
      }, 4000);

      this.channel
        .on('broadcast', { event: 'host-state' }, (payload) => {
          if (!isResolved) {
             isResolved = true;
             clearTimeout(connectionTimeout);
             resolve();
          }
          this.onHostData(payload.payload);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Connected to channel, pinging host...');
            this.channel!.track({ playerId: this.playerId, name: playerName }).then(() => {
              this.send({ type: 'join', name: playerName });
            });
          }
          if (status === 'CHANNEL_ERROR') {
            if (!isResolved) {
               isResolved = true;
               clearTimeout(connectionTimeout);
               reject(new Error('Could not connect to room channel.'));
            }
          }
        });
    });
  }

  public send(data: any) {
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'client-action',
        payload: { playerId: this.playerId, action: data }
      });
    }
  }

  public destroy() {
    this.channel?.unsubscribe();
  }
}
