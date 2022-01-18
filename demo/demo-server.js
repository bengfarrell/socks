import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
    port: 8138,
});

const sockets = [];

wss.on('connection', (ws) => {
    sockets.push(ws);
    ws.on('message', (data, isBinary) => {
        // eslint-disable-next-line no-console
        console.log('on message', JSON.parse(data.toString()), isBinary)
    });
});
