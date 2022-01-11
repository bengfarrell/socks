export class EventEmitter {
    listeners = [];

    /**
     * aAdd event listener.
     */
    addEventListener(type, callback) {
        const listener = { type, callback };
        this.listeners.push(listener);
        return listener;
    }

    /**
     * Remove event listener.
     * @param listener - Event listener to remove.
     */
    removeEventListener(listener) {
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
    removeEventListeners(listeners) {
        listeners.forEach((listener) => {
            this.removeEventListener(listener);
        });
    }

    /**
     * Trigger event.
     * @param ce - Custom event to dispatch.
     */
    dispatchEvent(e) {
        const listeners = this.listeners.slice();
        listeners.forEach(function(l) {
            if (ce.type === l.type) {
                l.callback.apply(this, [ce]);
            }
        });
    }
}
