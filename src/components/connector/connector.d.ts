import { LitElement } from 'lit';
import { Connection } from '../../connection';
import { BlenderCommand } from '../../blender-command';
export declare class ConnectorComponent extends LitElement {
    /**
     * host to use
     */
    host: string;
    /**
     * port to use
     */
    port: number;
    /**
     * autoconnect when component is added to the dom
     */
    autoconnect: boolean;
    /**
     * show last activity in text
     */
    showActivity: boolean;
    /**
     * status of connection
     */
    get status(): string;
    protected statusEl?: HTMLElement;
    protected connection?: Connection;
    protected _status: 'connected' | 'pending' | 'none';
    protected lastActivity?: string;
    static get styles(): import("lit").CSSResult[];
    connectedCallback(): void;
    protected render(): import("lit-html").TemplateResult<1>;
    send(commands: BlenderCommand[] | BlenderCommand): void;
    connect(host: string, port: number): void;
    sendEvent(type: string): void;
}
//# sourceMappingURL=connector.d.ts.map