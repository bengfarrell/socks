import { __decorate } from "tslib";
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styles } from './sceneview.css';
let SceneView = class SceneView extends LitElement {
    static get styles() {
        return [styles];
    }
    set scene(data) {
        this._scene = data;
        this._selected = this._scene.selected;
        this.requestUpdate();
    }
    set selected(items) {
        this._selected = items;
        this.requestUpdate();
    }
    render() {
        if (this._scene) {
            return html `<h4>${this._scene.scene}</h4>
                <ul>${this._scene.objects.map((obj) => {
                const classes = { selected: this._selected.indexOf(obj) !== -1 };
                return html `<li class=${classMap(classes)}>${obj}</li>`;
            })}</ul>`;
        }
        return undefined;
    }
};
__decorate([
    property({ attribute: true, reflect: true })
], SceneView.prototype, "scene", null);
__decorate([
    property({ attribute: true, reflect: true })
], SceneView.prototype, "selected", null);
SceneView = __decorate([
    customElement('socks-sceneview')
], SceneView);
export { SceneView };
//# sourceMappingURL=sceneview.js.map