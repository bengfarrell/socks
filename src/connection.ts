import { BlenderEvent } from './blender-event';
import { BlenderCommand } from './blender-command'
import { EventEmitter } from './eventemitter';

export class Connection extends EventEmitter {
    public static DEFAULT_HOST: string = 'localhost';

    public static DEFAULT_PORT: number = 8138;

    public connected: boolean = false;

    protected socket: WebSocket;

    constructor(host: string = Connection.DEFAULT_HOST, port: number = Connection.DEFAULT_PORT) {
        super();
        this.socket = new WebSocket(`ws://${host}:${port}`);
        this.socket.addEventListener('open', ((e: Event) => this.onOpenSocketConnection(e)) as any);
        this.socket.addEventListener('close', ((e: Event) => this.onCloseSocketConnection(e)) as any);
        this.socket.addEventListener('error', ((e: Event) => this.onSocketError(e)) as any);
        this.socket.addEventListener('message', ((e: MessageEvent) => this.onMessage(e)) as any);
    }

    public close() {
        this.connected = false;
        this.socket.close();
    }

    protected onOpenSocketConnection(e: Event) {
        this.connected = true;
        this.dispatchEvent(e);
    }

    protected onCloseSocketConnection(e: Event) {
        this.connected = false;
        this.dispatchEvent(e);
    }

    protected onSocketError(e: Event) {
        this.dispatchEvent(e);
    }

    onMessage(event: MessageEvent) {
        this.dispatchEvent(new BlenderEvent(BlenderEvent.BLENDER_MESSAGE,{ bubbles: true, composed: true, cancellable: true, scene: event.data }));
    }

    send(commands: BlenderCommand | BlenderCommand[]) {
        if (this.connected) {
            if (Array.isArray(commands)) {
                this.socket.send(JSON.stringify(commands))
            } else {
                this.socket.send(JSON.stringify([commands]))
            }
        }
    }
}
