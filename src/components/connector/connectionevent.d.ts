import { ConnectorComponent } from './connector';
import { Connection } from '../../connection';
export declare class SocketEvent extends Event {
    static OPEN: string;
    static CLOSE: string;
    static ERROR: string;
    static MESSAGE: string;
    component?: ConnectorComponent;
    connection?: Connection;
}
//# sourceMappingURL=connectionevent.d.ts.map