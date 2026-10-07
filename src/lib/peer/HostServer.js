import { supabase } from '../supabase';
export class HostServer {
    roomCode = '';
    channel = null;
    onPlayerAction;
    constructor(onStateChange, onPlayerAction) {
        this.onPlayerAction = onPlayerAction;
    }
    init() {
        return new Promise((resolve, reject) => {
            const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            let code = "";
            for (let i = 0; i < 6; i++)
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            this.roomCode = code;
            this.channel = supabase.channel(`room-${this.roomCode}`, { config: { broadcast: { self: true }, presence: { key: 'host' } } });
            this.channel
                .on('presence', { event: 'sync' }, () => {
                const state = this.channel.presenceState();
                const connectedIds = new Set();
                for (const key of Object.keys(state)) {
                    if (key !== 'host') {
                        state[key].forEach((p) => {
                            if (p.playerId)
                                connectedIds.add(p.playerId);
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
                    this.channel.track({ isHost: true });
                    resolve(this.roomCode);
                }
                if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                    reject(new Error('Channel error: ' + status));
                }
            });
        });
    }
    reconnect() {
        if (!this.roomCode)
            return;
        this.channel?.unsubscribe();
        this.channel = supabase.channel(`room-${this.roomCode}`, { config: { broadcast: { self: true }, presence: { key: 'host' } } });
        this.channel
            .on('presence', { event: 'sync' }, () => {
            const state = this.channel.presenceState();
            const connectedIds = new Set();
            for (const key of Object.keys(state)) {
                if (key !== 'host') {
                    state[key].forEach((p) => {
                        if (p.playerId)
                            connectedIds.add(p.playerId);
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
                console.log('Host channel reconnected:', this.roomCode);
                this.channel.track({ isHost: true });
            }
        });
    }
    broadcast(state) {
        if (this.channel) {
            this.channel.send({
                type: 'broadcast',
                event: 'host-state',
                payload: state
            });
        }
    }
    destroy() {
        this.channel?.unsubscribe();
    }
}
