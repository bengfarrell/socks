export const CURRENT_SELECTION = '__$current_selection__';

export const translateTo = (x, y, z) => {
    return {
        'translateto': { x, y, z }
    }
}

export const translateBy = (x, y, z) => {
    return {
        'translateby': { x, y, z }
    }
}

export const scaleTo = (x, y, z) => {
    return {
        'scaleto': { x, y, z }
    }
}

export const scaleBy = (x, y, z) => {
    return {
        'scaleby': { x, y, z }
    }
}

export const rotateTo = (x, y, z, w, order = 'xyz') => {
    return {
        'rotateto': { x, y, z }
    }
}

export const rotateBy = (x, y, z, w, order = 'xyz') => {
    return {
        'rotateby': { x, y, z }
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
     * @param objName - Blender object to update (array of names, or single string name)
     * @param props - Property values to update
     * @param keyframe - Keyframe
     * @param template - if named Blender object does not exist, clone from a Blender object named this
     */
    static update(objName, props, keyframe = undefined, template = undefined) {
        let target = objName;
        if (!Array.isArray(objName)) {
            target = [objName];
        }
        return JSON.stringify({
            command: 'update',
            target,
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
        let target = objName;
        if (!Array.isArray(objName)) {
            target = objName;
        }
        return {
            command: 'delete',
            target
        }
    }
}
