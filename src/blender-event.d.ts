export declare class BlenderEvent extends Event {
    static BLENDER_MESSAGE: string;
    messageType: string;
    scene?: any;
    selected?: string[];
    bones?: string[];
    armature?: string;
    constructor(type: string, props: any);
}
//# sourceMappingURL=blender-event.d.ts.map