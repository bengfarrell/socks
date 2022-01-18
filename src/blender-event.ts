export class BlenderEvent extends Event {
    public static BLENDER_MESSAGE: string = 'blendermessage';

    public scene: any;

    constructor(type: string, props: any) {
        super(type, props);
        this.scene = props.scene;
    }

}
