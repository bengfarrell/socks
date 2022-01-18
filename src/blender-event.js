export class BlenderEvent extends Event {
    constructor(type, props) {
        super(type, props);
        if (props.scene) {
            this.scene = props.scene;
        }
        if (props.selected) {
            this.selected = props.selected;
        }
    }
}
BlenderEvent.BLENDER_MESSAGE = 'blendermessage';
//# sourceMappingURL=blender-event.js.map