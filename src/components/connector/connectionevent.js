import { BlenderEvent } from '../../blender-event';
export class SocketEvent extends Event {
}
SocketEvent.OPEN = 'opensocket';
SocketEvent.CLOSE = 'closesocket';
SocketEvent.ERROR = 'socketerror';
SocketEvent.MESSAGE = BlenderEvent.BLENDER_MESSAGE;
//# sourceMappingURL=connectionevent.js.map