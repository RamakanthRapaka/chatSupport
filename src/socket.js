import { Server } from "socket.io";
import { authenticateSocket } from "./auth.js";
import { registerSocketEvents } from "./events.js";

export function registerSocketServer(server, config) {
  const io = new Server(server, {
    cors: {
      origin: config.frontendUrl,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const session = await authenticateSocket(socket, config);
      socket.data.session = session;
      next();
    } catch (error) {
      next(new Error(error instanceof Error ? error.message : "Socket authentication failed."));
    }
  });

  io.on("connection", (socket) => {
    const session = socket.data.session;
    console.log(`socket connected: user ${session.user.id}`);

    registerSocketEvents(io, socket, config);

    socket.on("disconnect", () => {
      console.log(`socket disconnected: user ${session.user.id}`);
    });
  });

  return io;
}
