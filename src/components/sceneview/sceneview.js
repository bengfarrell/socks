var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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