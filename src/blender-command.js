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
            template: params.template,
        };
        return command;
    }
    static update(params) {
        const command = {
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
    static delete(params) {
        return {
            command: 'delete',
            target: Array.isArray(params.target) ? params.target : [params.target],
        };
    }
}
//# sourceMappingURL=blender-command.js.map