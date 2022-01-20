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

export interface UpdateParams {
    // target of transforms (object name)
    target: string | string[],

    // list of transforms to apply in order to object
    transforms: (Translate | Scale | Rotate | Origin) | (Translate | Scale | Rotate | Origin)[],

    // keyframe if animating
    keyframe?: number,

    // use template if target is not found
    template?: string,
}

interface UpdateCommand {
    command: 'update',

    // target of transforms (object name)
    target: string[],

    // list of transforms to apply in order to object
    transforms: (Translate | Scale | Rotate | Origin)[],

    // keyframe if animating
    keyframe?: number,

    // use template if target is not found
    template?: string,
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

    static requestSelection() {
        return {
            command: 'selectioninfo',
        }
    }

    static update(params: UpdateParams): UpdateCommand {
        const command: UpdateCommand = {
            command: 'update',
            target: Array.isArray(params.target) ? params.target : [params.target],
            transforms: Array.isArray(params.transforms) ? params.transforms : [params.transforms],
        };
        if (params.keyframe) {
            command.keyframe = params.keyframe;
        }
        if (params.template) {
            command.template = params.template;
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
