import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styles } from './connector.css';
import { Connection } from '../../connection';
import { BlenderCommand } from '../../blender-command';
import { SocketEvent } from './connectionevent';
import { BlenderEvent } from '../../blender-event';
import { SceneView } from '../sceneview/sceneview';

@customElement('socks-connector')
export class ConnectorComponent extends LitElement {
  /**
   * host to use
   */
  @property()
  public host: string = Connection.DEFAULT_HOST;

  /**
   * port to use
   */
  @property()
  public port: number = Connection.DEFAULT_PORT;

  /**
   * autoconnect when component is added to the dom
   */
  @property({ attribute: true, reflect: true, type: Boolean })
  public autoconnect: boolean = false;

  /**
   * show last activity in text
   */
  @property({ attribute: true, reflect: true, type: Boolean })
  public showActivity: boolean = false;

  /**
   * status of connection
   */
  @property({ attribute: true, reflect: true })
  public get status(): string {
    return this._status;
  }

  @query('#status')
  protected statusEl?: HTMLElement;

  @query('socks-sceneview')
  protected sceneViewEl?: SceneView;

  protected connection?: Connection;

  protected _status: 'connected' | 'pending' | 'none' = 'none';

  protected lastActivity?: string;

  public static get styles() {
    return [styles];
  }

  public connectedCallback() {
    super.connectedCallback();
    if (this.autoconnect) {
      this.connect(this.host, this.port);
    }
  }

  protected render() {
    return html`<div id="status"></div>
      <button
        @click=${() => {
          if (this.connection?.connected) {
            this.connection.close();
            return;
          }
          this.connect(this.host, this.port);
        }}
      >
        ${this.connection?.connected ? 'disconnect' : 'connect'}
      </button>
      <input
        type="text"
        value=${this.host}
        @change=${(event: InputEvent) => {
          this.host = (event.currentTarget as HTMLInputElement)?.value;
        }}
      />
      &nbsp:&nbsp
      <input
        type="number"
        value=${this.port}
        @change=${(event: InputEvent) => {
          this.port = Number((event.currentTarget as HTMLInputElement)?.value);
        }}
      />
        <button ?disabled=${!this.connection?.connected} @click=${() => {
          this.connection?.send(BlenderCommand.requestScene())
        }}>Get Scene</button>
        <button ?disabled=${!this.connection?.connected} @click=${() => {
          this.connection?.send(BlenderCommand.requestSelection())
        }}>Get Selection</button>
        ${this.showActivity ? html`<br /><span id='activity'>${this.lastActivity}</span>` : undefined}
        <socks-sceneview></socks-sceneview>`;
  }

  public send(commands: BlenderCommand[] | BlenderCommand) {
    if (this.connection) {
      this.statusEl?.classList.toggle('active', false);
      requestAnimationFrame(() => {
        this.statusEl?.classList.toggle('active', true);
      });
      this.connection.send(commands);
      this.lastActivity = `Sent command to Blender}`;
      this.requestUpdate('status');
      this.requestUpdate('lastActivity');
    }
  }

  public connect(host: string, port: number) {
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

    this.connection.addEventListener('error', (e: Event) => {
      this.lastActivity = `Cannot connect to ${(e.currentTarget as WebSocket).url}`;
      // eslint-disable-next-line no-console
      console.warn(this.lastActivity);
      this.statusEl?.classList.toggle('error', false);
      requestAnimationFrame(() => {
        this.statusEl?.classList.toggle('error', true);
      });
      this.requestUpdate('status');
      this.requestUpdate('lastActivity');
      this.sendEvent(SocketEvent.ERROR);
    });

    this.connection.addEventListener(BlenderEvent.BLENDER_MESSAGE, (e: BlenderEvent) => {
      if (this.sceneViewEl) {
        if (e.scene) {
          this.sceneViewEl.scene = e.scene;
        }
        if (e.selected) {
          this.sceneViewEl.selected = e.selected;
        }
      }
      this.dispatchEvent(e as Event);
    });
  }

  sendEvent(type: string) {
    const event: SocketEvent = new SocketEvent(type, { bubbles: true, composed: true, cancelable: true});
    event.component = this;
    event.connection = this.connection;
    this.dispatchEvent(event);
  }
}
