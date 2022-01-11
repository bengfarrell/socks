import { BlenderEvent } from './blender-event';
import { BlenderCommand } from './blender-command'
import { EventEmitter } from './eventemitter.js';

export class Connection extends EventEmitter {
    constructor(host = 'localhost', port = 8137) {
        super();
        this.connected = false;
        this.socket = new WebSocket(`ws://${host}:${port}`);
        this.socket.addEventListener('open', (e) => this.onOpenSocketConnection(e));
        this.socket.addEventListener('message', (e) => this.onMessage(e));
    }

    onOpenSocketConnection(event) {
        this.connected = true;
    }

    onMessage(event) {
        new BlenderEvent({ scene: event.data })
    }

    send(blenderCmds) {
        if (this.connected) {
            if (Array.isArray(blenderCmds)) {
                this.socket.send(blenderCmds)
            } else {
                this.socket.send([blenderCmds])
            }
        }
    }
}
