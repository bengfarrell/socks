import { ConnectorComponent } from './connector';
import { Connection } from '../../connection';
import { BlenderEvent } from '../../blender-event';

export class ConnectionEvent extends Event {
    public static OPEN: string = 'opensocket';

    public static CLOSE: string = 'closesocket';

    public static ERROR: string = 'socketerror';

    public static MESSAGE: string = BlenderEvent.BLENDER_MESSAGE;

    public component?: ConnectorComponent;

    public connection?: Connection
}
