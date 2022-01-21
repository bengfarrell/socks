import { BlenderEvent } from '../../blender-event';
export class ConnectionEvent extends Event {
}
ConnectionEvent.OPEN = 'opensocket';
ConnectionEvent.CLOSE = 'closesocket';
ConnectionEvent.ERROR = 'socketerror';
ConnectionEvent.MESSAGE = BlenderEvent.BLENDER_MESSAGE;
//# sourceMappingURL=connectionevent.js.map