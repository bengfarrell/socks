export const CURRENT_SELECTION = '__$current_selection__';
export class BlenderCommand {
    static requestScene() {
        return {
            command: 'sceneinfo',
        };
    }
    static requestSelection() {
        return {
            command: 'selectioninfo',
        };
    }
    static clone(params) {
        const command = {
            command: 'update',
            target: Array.isArray(params.target) ? params.target : [params.target],
            clone: { ...params.clone },
        };
        return command;
    }
    static update(params) {
        if (!params.transforms) {
            this.clone(params);
        }
        const command = {
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
    static delete(params) {
        return {
            command: 'delete',
            target: Array.isArray(params.target) ? params.target : [params.target],
        };
    }
}
//# sourceMappingURL=blender-command.js.map