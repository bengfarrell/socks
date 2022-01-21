import { BlenderEvent } from './blender-event';
import { EventEmitter } from './eventemitter';
export class Connection extends EventEmitter {
    constructor(host = Connection.DEFAULT_HOST, port = Connection.DEFAULT_PORT) {
        super();
        this.connected = false;
        this.socket = new WebSocket(`ws://${host}:${port}`);
        this.socket.addEventListener('open', ((e) => this.onOpenSocketConnection(e)));
        this.socket.addEventListener('close', ((e) => this.onCloseSocketConnection(e)));
        this.socket.addEventListener('error', ((e) => this.onSocketError(e)));
        this.socket.addEventListener('message', ((e) => this.onMessage(e)));
    }
    close() {
        this.connected = false;
        this.socket.close();
    }
    onOpenSocketConnection(e) {
        this.connected = true;
        this.dispatchEvent(e);
    }
    onCloseSocketConnection(e) {
        this.connected = false;
        this.dispatchEvent(e);
    }
    onSocketError(e) {
        this.dispatchEvent(e);
    }
    onMessage(event) {
        const data = JSON.parse(event.data);
        const params = {};
        if (data.scene) {
            params.scene = data;
            params.selected = data.selected || [];
        }
        else {
            params.selected = data || [];
        }
        this.dispatchEvent(new BlenderEvent(BlenderEvent.BLENDER_MESSAGE, Object.assign({ bubbles: true, composed: true, cancellable: true }, params)));
    }
    send(commands) {
        if (this.connected) {
            if (Array.isArray(commands)) {
                this.socket.send(JSON.stringify(commands));
            }
            else {
                this.socket.send(JSON.stringify([commands]));
            }
        }
    }
}
Connection.DEFAULT_HOST = 'localhost';
Connection.DEFAULT_PORT = 8138;
//# sourceMappingURL=connection.js.map