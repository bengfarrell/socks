export class BlenderEvent extends Event {
    constructor(type, props) {
        super(type, props);
        this.messageType = props.data.messagetype;
        if (props.data.message.scene) {
            this.scene = props.data.scene;
        }
        if (props.data.message.selected) {
            this.selected = props.data.selected;
        }
        if (props.data.message.bones) {
            this.bones = props.data.message.bones;
        }
        if (props.data.message.armature) {
            this.armature = props.data.message.armature;
        }
    }
}
BlenderEvent.BLENDER_MESSAGE = 'blendermessage';
//# sourceMappingURL=blender-event.js.map