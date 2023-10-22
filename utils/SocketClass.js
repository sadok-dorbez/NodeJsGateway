const { Server } = require("socket.io");
const MsgService = require("../module/Messages/service");


module.exports = class SocketClass extends Server {
  constructor(server, opts) {
    super(server, opts);
    this.setupListeners();
  }

  setupListeners() {
    this.on("connection", (socket) => {
      console.log("Client connected");
      // start of socket

      socket.on("new-message", (data) => {
        console.log("New message:", data);
        io.emit("new-message", data);
        // Save message to database
        MsgService.save(data);
      });
      // end of course chat socket
      // Listen for disconnections
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }
};
