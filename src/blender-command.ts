export interface Transform {
    transform: string;
    relative?: boolean;
    x?: number;
    y?: number;
    z?: number;
}

export interface CloneOptions {
    // use template if target is not found
    template: string,

    // sleep between clones, protects against cloning too quickly and crashing
    sleep?: number,

    // if linking to create clones
    linked?: boolean,
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
    // target of transforms (object name)
    target: string | string[],
}

export interface CloneParams {
    // target of clone (object name)
    target: string | string[],

    // clone options
    clone: CloneOptions
}

export interface UpdateParams {
    // target of transforms (object name)
    target: string | string[],

    // list of transforms to apply in order to object
    transforms: (Translate | Scale | Rotate | Origin) | (Translate | Scale | Rotate | Origin)[],

    // keyframe if animating
    keyframe?: number,

    // clone options
    clone?: CloneOptions
}

interface UpdateCommand {
    command: 'update',

    // target of transforms (object name)
    target: string[],

    // list of transforms to apply in order to object
    transforms: (Translate | Scale | Rotate | Origin)[],

    // keyframe if animating
    keyframe?: number,

    // clone options
    clone?: CloneOptions
}

interface CloneCommand {
    command: 'update',

    // target of clone (object name)
    target: string[],

    // clone options
    clone?: CloneOptions
}

interface DeleteCommand {
    command: 'delete',

    // target of deletes (object name)
    target: string[],
}

export const CURRENT_SELECTION = '__$current_selection__';

export class BlenderCommand {
    static requestScene() {
        return {
            command: 'sceneinfo',
        }
    }

    static requestBonesForArmature(name: string) {
        return {
            command: 'armatureinfo',
            name
        }
    }

    static requestSelection() {
        return {
            command: 'selectioninfo',
        }
    }

    static clone(params: CloneParams ): CloneCommand {
        const command: CloneCommand = {
            command: 'update',
            target: Array.isArray(params.target) ? params.target : [params.target],
            clone: { ...params.clone },
        };
        return command;
    }

    static update(params: UpdateParams): UpdateCommand {
        if (!params.transforms) {
            this.clone(params as CloneParams);
        }
        const command: UpdateCommand = {
            command: 'update',
            target: Array.isArray(params.target) ? params.target : [params.target],
            transforms: Array.isArray(params.transforms) ? params.transforms : [params.transforms],
        };
        if (params.keyframe) {
            command.keyframe = params.keyframe;
        }
        if (params.clone) {
            command.clone = { ...params.clone };
        }
        return command;
    }

    static delete(params: DeleteParams): DeleteCommand {
        return {
            command: 'delete',
            target: Array.isArray(params.target) ? params.target : [params.target],
        };
    }
}
