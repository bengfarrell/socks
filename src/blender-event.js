export class BlenderEvent extends Event {
    constructor(type, props) {
        super(type, props);
        this.scene = props.scene;
    }
}
BlenderEvent.BLENDER_MESSAGE = 'blendermessage';
//# sourceMappingURL=blender-event.js.map