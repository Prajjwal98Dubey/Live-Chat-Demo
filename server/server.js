import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import WebSocket from "ws";
const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  socket.on("message", (payload) => {
    if (JSON.parse(payload).userName) {
      let { userName } = JSON.parse(payload);
      Object.defineProperty(socket, "username", { value: userName });
      console.log("user connected", socket.username);
    } else {
      const { data, user } = JSON.parse(payload);
      wss.clients.forEach(function each(client) {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ data, user }));
        }
      });
    }
  });
});
server.listen("8080", () => console.log("server listening at 8080🚀"));
