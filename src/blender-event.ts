export class BlenderEvent extends Event {
    public static BLENDER_MESSAGE: string = 'blendermessage';

    public scene: any;

    public selected?: string[];

    constructor(type: string, props: any) {
        super(type, props);

        if (props.scene) {
            this.scene = props.scene;
        }

        if (props.selected) {
            this.selected = props.selected;
        }
    }

}
