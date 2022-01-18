import { BlenderCommand } from './blender-command';
import { EventEmitter } from './eventemitter';
export declare class Connection extends EventEmitter {
    static DEFAULT_HOST: string;
    static DEFAULT_PORT: number;
    connected: boolean;
    protected socket: WebSocket;
    constructor(host?: string, port?: number);
    close(): void;
    protected onOpenSocketConnection(e: Event): void;
    protected onCloseSocketConnection(e: Event): void;
    protected onSocketError(e: Event): void;
    onMessage(event: MessageEvent): void;
    send(commands: BlenderCommand | BlenderCommand[]): void;
}
//# sourceMappingURL=connection.d.ts.map