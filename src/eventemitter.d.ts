export declare class EventEmitter {
    protected listeners: {
        type: string;
        callback: Function;
    }[];
    /**
     * aAdd event listener.
     */
    addEventListener(type: string, callback: Function): {
        type: string;
        callback: Function;
    };
    /**
     * Remove event listener.
     * @param listener - Event listener to remove.
     */
    removeEventListener(listener: {
        type: string;
        callback: Function;
    }): void;
    /**
     * Remove event listeners.
     * @param listeners - List of event listeners to remove.
     */
    removeEventListeners(listeners: {
        type: string;
        callback: Function;
    }[]): void;
    /**
     * Trigger event.
     * @param event to dispatch
     */
    dispatchEvent(e: Event): void;
}
//# sourceMappingURL=eventemitter.d.ts.map