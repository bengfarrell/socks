import { ConnectorComponent } from './connector';
import { Connection } from '../../connection';
export declare class ConnectionEvent extends Event {
    static OPEN: string;
    static CLOSE: string;
    static ERROR: string;
    static MESSAGE: string;
    component?: ConnectorComponent;
    connection?: Connection;
}
//# sourceMappingURL=connectionevent.d.ts.map