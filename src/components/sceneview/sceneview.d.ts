import { LitElement } from 'lit';
export declare class SceneView extends LitElement {
    protected _scene: any;
    protected _selected: any;
    static get styles(): import("lit").CSSResult[];
    set scene(data: JSON);
    set selected(items: string[]);
    render(): import("lit-html").TemplateResult<1> | undefined;
}
//# sourceMappingURL=sceneview.d.ts.map