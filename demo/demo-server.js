import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
    port: 8080,
});

const sockets = [];

wss.on('connection', function connection(ws, req) {
    sockets.push(ws);
    ws.on('message', function message(data, isBinary) {
        console.log('on message', JSON.parse(data.toString()), isBinary)
    });
});
