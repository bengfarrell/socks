export class EventEmitter {
    protected listeners: { type: string, callback: Function }[] = [];

    /**
     * aAdd event listener.
     */
    addEventListener(type: string, callback: Function) {
        const listener: { type: string, callback: Function } = { type, callback };
        this.listeners.push(listener);
        return listener;
    }

    /**
     * Remove event listener.
     * @param listener - Event listener to remove.
     */
    removeEventListener(listener: { type: string, callback: Function }) {
        for (let c = 0; c < this.listeners.length; c++) {
            if (listener === this.listeners[c]) {
                this.listeners.splice(c, 1);
                return;
            }
        }
    }

    /**
     * Remove event listeners.
     * @param listeners - List of event listeners to remove.
     */
    removeEventListeners(listeners: { type: string, callback: Function }[]) {
        listeners.forEach((listener) => {
            this.removeEventListener(listener);
        });
    }

    /**
     * Trigger event.
     * @param event to dispatch
     */
    dispatchEvent(e: Event) {
        const listeners = this.listeners.slice();
        listeners.forEach(function(l) {
            if (e.type === l.type) {
                // @ts-ignore
                l.callback.apply(this, [e]);
            }
        });
    }
}
