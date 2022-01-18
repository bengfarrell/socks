import { html, LitElement } from 'lit';
import { customElement , property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styles } from './sceneview.css';

@customElement('socks-sceneview')
export class SceneView extends LitElement {
    protected _scene: any;

    protected _selected: any;

    public static get styles() {
        return [styles];
    }

    @property({ attribute: true, reflect: true })
    public set scene(data: JSON) {
        this._scene = data;
        this._selected = this._scene.selected;
        this.requestUpdate();
    }

    @property({ attribute: true, reflect: true })
    public set selected(items: string[]) {
        this._selected = items;
        this.requestUpdate();
    }

    render() {
        if (this._scene) {
            return html`<h4>${this._scene.scene}</h4>
                <ul>${this._scene.objects.map((obj: string) => {
                    const classes = { selected: this._selected.indexOf(obj) !== -1 };
                    return html`<li class=${classMap(classes)}>${obj}</li>`; })}</ul>`;
        }
        return undefined;
    }
}
