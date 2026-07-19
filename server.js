import http from "node:http";
import { createApp } from "./src/app.js";
import { loadConfig } from "./src/config.js";
import { registerSocketServer } from "./src/socket.js";

const config = loadConfig();
const app = createApp(config);
const server = http.createServer(app);

registerSocketServer(server, config);

server.listen(config.port, () => {
  console.log(`chatSupport running on port ${config.port}`);
});
