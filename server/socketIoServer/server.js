const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 3001;
const app = express();

// Create HTTP server
const server = createServer(app);

// Initialize socket.io with HTTP server & CORS config
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (change for production)
    methods: ["GET", "POST"],
  },
});

// Setup socket.io connection handler
io.on("connection", (socket) => {
  console.log("⚡️ New client connected, socket id:", socket.id);

  socket.on("joinRoom", ({ conversationId }) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined room: ${conversationId}`);
  });

  socket.on("newMessage", (data) => {
    // Broadcast the message to everyone in the room except the sender
    const { conversationId, message, senderId, senderType, date } = data;
    console.log(`new message : --------->`, {
      conversationId,
      message,
      senderId,
      senderType,
      date,
    });
    socket.to(conversationId).emit("newMessage", {
      message,
      conversationId,
      senderId,
      senderType,
      date,
    });
  });
  socket.on("clearMessages", ({ conversationId }) => {
    socket.to(conversationId).emit("clearMessages");
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});
server.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
setInterval(async () => {
  const rooms = io.sockets.adapter.rooms;

  // Iterate over all rooms
  for (const [roomName, socketsSet] of rooms) {
    // Skip rooms that are socket IDs themselves (each socket is in a room named by its own ID)
    if (io.sockets.sockets.has(roomName)) continue;

    // Fetch sockets in this room
    const sockets = await io.in(roomName).fetchSockets();
    const socketIds = sockets.map((s) => s.id);

    console.log(`Room: ${roomName} | Sockets: [${socketIds.join(", ")}]`);
  }
}, 5000);
