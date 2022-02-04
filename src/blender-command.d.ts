export interface Transform {
    transform: string;
    relative?: boolean;
    x?: number;
    y?: number;
    z?: number;
}
export interface CloneOptions {
    template: string;
    sleep?: number;
    linked?: boolean;
}
export interface Translate extends Transform {
    transform: 'translate';
}
export interface Scale extends Transform {
    transform: 'scale';
}
export interface Origin extends Transform {
    transform: 'origin';
}
export interface Rotate extends Transform {
    transform: 'rotate';
    w?: number;
    order?: 'xyz' | 'zyx';
}
export interface DeleteParams {
    target: string | string[];
}
export interface CloneParams {
    target: string | string[];
    clone: CloneOptions;
}
export interface UpdateParams {
    target: string | string[];
    transforms: (Translate | Scale | Rotate | Origin) | (Translate | Scale | Rotate | Origin)[];
    keyframe?: number;
    clone?: CloneOptions;
}
interface UpdateCommand {
    command: 'update';
    target: string[];
    transforms: (Translate | Scale | Rotate | Origin)[];
    keyframe?: number;
    clone?: CloneOptions;
}
interface CloneCommand {
    command: 'update';
    target: string[];
    clone?: CloneOptions;
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
    static requestBonesForArmature(name: string): {
        command: string;
        name: string;
    };
    static requestSelection(): {
        command: string;
    };
    static clone(params: CloneParams): CloneCommand;
    static update(params: UpdateParams): UpdateCommand;
    static delete(params: DeleteParams): DeleteCommand;
}
export {};
//# sourceMappingURL=blender-command.d.ts.map