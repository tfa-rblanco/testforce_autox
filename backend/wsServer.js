import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8000 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    // Only forward messages that are in a valid format (JSON)
    try {
      const parsedMessage = JSON.parse(message);
      console.log("Message received:", parsedMessage);

      // Broadcast to all clients except the sender
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client !== ws) {
          client.send(message);
        }
      });
    } catch (error) {
      console.log("Invalid message format", error);
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
});

console.log("WebSocket server running on port 8000");