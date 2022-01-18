import { ConnectorComponent } from './connector';
import { Connection } from '../../connection';

export class SocketEvent extends Event {
    public static OPEN: string = 'opensocket';

    public component?: ConnectorComponent;

    public connection?: Connection
}
