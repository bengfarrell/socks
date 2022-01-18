export class BlenderEvent extends Event {
    public scene: any;

    constructor(props: any) {
        super(props);
        this.scene = props.scene;
    }

}
