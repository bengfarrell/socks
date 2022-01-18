import { css } from 'lit';
export const styles = css `
  :host {
    --status-color: #eaeaea;
    --status-color-connected: #78de78;
    --status-color-error: red;
    --status-color-activity: #faf200;
    --status-color-pending: #ff9900;
    --status-indicator-size: 10px;
    --status-animation-time: 100ms;
    --activity-padding: 6px 15px;
  }

  :host([status="error"]) #status {
    background-color: var(--socks-status-color-error,
    var(--status-color-error));
  }

  :host([status="connected"]) #status {
    background-color: var(--socks-status-color-connected,
    var(--status-color-connected));
  }

  :host([status="connected"]) #status.active {
    animation-name: activity;
    animation-duration: var(--socks-status-animation-time, var(--status-animation-time));
  }

  :host #status.error {
    animation-name: error;
    animation-duration: var(--socks-status-animation-time, var(--status-animation-time));
  }

  :host([status="pending"]) #status {
    background-color: var(--socks-status-color-pending,
    var(--status-color-pending));
  }

  #status {
    background-color: var(--socks-status-color, var(--status-color));
    width: var(--socks-status-indicator-size, var(--status-indicator-size));
    height: var(--socks-status-indicator-size, var(--status-indicator-size));
    border-radius: var(--socks-status-indicator-size, var(--status-indicator-size));
    display: inline-block;
  }
  
  #activity {
    display: inline-block;
    padding: var(--socks-activity-padding, var(--activity-padding));
  }

  @keyframes activity {
    0% {
      background-color: var(--socks-status-color, var(--status-color));
    }
    50% {
      background-color: var(--socks-status-color-activity, var(--status-color-activity));
    }
    100% {
      background-color: var(--socks-status-color, var(--status-color));
    }
  }

  @keyframes error {
    0% {
      background-color: var(--socks-status-color, var(--status-color));
    }
    50% {
      background-color: var(--socks-status-color-error, var(--status-color-error));
    }
    100% {
      background-color: var(--socks-status-color, var(--status-color));
    }
  }

`;
//# sourceMappingURL=connector.css.js.map