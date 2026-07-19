import { apiGet } from "./httpClient.js";

function extractBearerToken(socket) {
  const authToken = socket.handshake.auth?.token;
  if (authToken && typeof authToken === "string") {
    return authToken.replace(/^Bearer\s+/i, "").trim();
  }

  const header = socket.handshake.headers?.authorization;
  if (header && typeof header === "string") {
    return header.replace(/^Bearer\s+/i, "").trim();
  }

  return null;
}

export async function authenticateSocket(socket, config) {
  const token = extractBearerToken(socket);
  if (!token) {
    throw new Error("Authentication token is required.");
  }

  const user = await apiGet(`${config.fastapiBaseUrl}/auth/me`, token);

  return {
    token,
    user,
  };
}
