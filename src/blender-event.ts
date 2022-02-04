export class BlenderEvent extends Event {
    public static BLENDER_MESSAGE: string = 'blendermessage';

    public messageType!: string;

    public scene?: any;

    public selected?: string[];

    public bones?: string[];

    public armature?: string;

    constructor(type: string, props: any) {
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
