export interface Transform {
    transform: string;
    relative?: boolean;
    x?: number;
    y?: number;
    z?: number;
}
export interface Translate extends Transform {
    transform: 'translate';
}
export interface Scale extends Transform {
    transform: 'scale';
}
export interface Rotate extends Transform {
    transform: 'rotate';
    w?: number;
    order?: 'xyz' | 'zyx';
}
export interface DeleteParams {
    target: string | string[];
}
export interface UpdateParams {
    target: string | string[];
    transforms: (Translate | Scale | Rotate) | (Translate | Scale | Rotate)[];
    keyframe?: number;
    template?: string;
}
interface UpdateCommand {
    command: 'update';
    target: string[];
    transforms: (Translate | Scale | Rotate)[];
    keyframe?: number;
    template?: string;
}
interface DeleteCommand {
    command: 'delete';
    target: string[];
}
export declare const CURRENT_SELECTION = "__$current_selection__";
export declare class BlenderCommand {
    static requestScene(): {
        command: string;
    };
    static requestSelection(): {
        command: string;
    };
    static update(params: UpdateParams): UpdateCommand;
    static delete(params: DeleteParams): DeleteCommand;
}
export {};
//# sourceMappingURL=blender-command.d.ts.map