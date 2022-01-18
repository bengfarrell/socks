var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styles } from './connector.css';
import { Connection } from '../../connection';
import { BlenderCommand } from '../../blender-command';
import { SocketEvent } from './connectionevent';
import { BlenderEvent } from '../../blender-event';
let ConnectorComponent = class ConnectorComponent extends LitElement {
    constructor() {
        super(...arguments);
        /**
         * host to use
         */
        this.host = Connection.DEFAULT_HOST;
        /**
         * port to use
         */
        this.port = Connection.DEFAULT_PORT;
        /**
         * autoconnect when component is added to the dom
         */
        this.autoconnect = false;
        /**
         * show last activity in text
         */
        this.showActivity = false;
        this._status = 'none';
    }
    /**
     * status of connection
     */
    get status() {
        return this._status;
    }
    static get styles() {
        return [styles];
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.autoconnect) {
            this.connect(this.host, this.port);
        }
    }
    render() {
        var _a, _b, _c;
        return html `<div id="status"></div>
      <button
        @click=${() => {
            var _a;
            if ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.connected) {
                this.connection.close();
                return;
            }
            this.connect(this.host, this.port);
        }}
      >
        ${((_a = this.connection) === null || _a === void 0 ? void 0 : _a.connected) ? 'disconnect' : 'connect'}
      </button>
      <input
        type="text"
        value=${this.host}
        @change=${(event) => {
            var _a;
            this.host = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.value;
        }}
      />
      &nbsp:&nbsp
      <input
        type="number"
        value=${this.port}
        @change=${(event) => {
            var _a;
            this.port = Number((_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.value);
        }}
      />
        <button ?disabled=${!((_b = this.connection) === null || _b === void 0 ? void 0 : _b.connected)} @click=${() => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.send(BlenderCommand.requestScene());
        }}>Get Scene</button>
        <button ?disabled=${!((_c = this.connection) === null || _c === void 0 ? void 0 : _c.connected)} @click=${() => {
            var _a;
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.send(BlenderCommand.requestSelection());
        }}>Get Selection</button>
        ${this.showActivity ? html `<br /><span id='activity'>${this.lastActivity}</span>` : undefined}`;
    }
    send(commands) {
        var _a;
        if (this.connection) {
            (_a = this.statusEl) === null || _a === void 0 ? void 0 : _a.classList.toggle('active', false);
            requestAnimationFrame(() => {
                var _a;
                (_a = this.statusEl) === null || _a === void 0 ? void 0 : _a.classList.toggle('active', true);
            });
            this.connection.send(commands);
            this.lastActivity = `Sent command to Blender}`;
            this.requestUpdate('status');
            this.requestUpdate('lastActivity');
        }
    }
    connect(host, port) {
        this._status = 'pending';
        this.requestUpdate('status');
        this.connection = new Connection(host, port);
        this.connection.addEventListener('open', () => {
            this._status = 'connected';
            this.lastActivity = `Connected to ${host}:${port}`;
            this.requestUpdate('status');
            this.requestUpdate('lastActivity');
            this.sendEvent(SocketEvent.OPEN);
        });
        this.connection.addEventListener('close', () => {
            this._status = 'none';
            this.lastActivity = `Connection closed`;
            this.requestUpdate('status');
            this.requestUpdate('lastActivity');
            this.sendEvent(SocketEvent.CLOSE);
        });
        this.connection.addEventListener('error', (e) => {
            var _a;
            this.lastActivity = `Cannot connect to ${e.currentTarget.url}`;
            // eslint-disable-next-line no-console
            console.warn(this.lastActivity);
            (_a = this.statusEl) === null || _a === void 0 ? void 0 : _a.classList.toggle('error', false);
            requestAnimationFrame(() => {
                var _a;
                (_a = this.statusEl) === null || _a === void 0 ? void 0 : _a.classList.toggle('error', true);
            });
            this.requestUpdate('status');
            this.requestUpdate('lastActivity');
            this.sendEvent(SocketEvent.ERROR);
        });
        this.connection.addEventListener(BlenderEvent.BLENDER_MESSAGE, (e) => {
            this.dispatchEvent(e);
        });
    }
    sendEvent(type) {
        const event = new SocketEvent(type, { bubbles: true, composed: true, cancelable: true });
        event.component = this;
        event.connection = this.connection;
        this.dispatchEvent(event);
    }
};
__decorate([
    property()
], ConnectorComponent.prototype, "host", void 0);
__decorate([
    property()
], ConnectorComponent.prototype, "port", void 0);
__decorate([
    property({ attribute: true, reflect: true, type: Boolean })
], ConnectorComponent.prototype, "autoconnect", void 0);
__decorate([
    property({ attribute: true, reflect: true, type: Boolean })
], ConnectorComponent.prototype, "showActivity", void 0);
__decorate([
    property({ attribute: true, reflect: true })
], ConnectorComponent.prototype, "status", null);
__decorate([
    query('#status')
], ConnectorComponent.prototype, "statusEl", void 0);
ConnectorComponent = __decorate([
    customElement('socks-connector')
], ConnectorComponent);
export { ConnectorComponent };
//# sourceMappingURL=connector.js.map