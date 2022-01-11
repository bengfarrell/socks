export const CURRENT_SELECTION = '__$current_selection__';

export const createTranslate = (x, y, z) => {
    return {
        type: 'translate',
        x, y, z
    }
}

export const createScale = (x, y, z) => {
    return {
        type: 'scale',
        x, y, z
    }
}

export const createRotation = (x, y, z, w, order = 'xyz') => {
    return {
        type: 'rotation',
        x, y, z, w
    }
}

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

    /**
     * @param objName - Blender object to update
     * @param props - Property values to update
     * @param keyframe - Keyframe
     * @param template - if named Blender object does not exist, clone from a Blender object named this
     */
    static update(objName, props, keyframe = undefined, template = undefined) {
        return JSON.stringify({
            command: 'update',
            target: objName,
            ...props,
            keyframe,
            template
        });
    }

    /**
     * @param objName - Blender object to update
     * @returns {{name}}
     */
    static delete(objName) {
        return {
            command: 'delete',
            name: objName,
        }
    }
}
