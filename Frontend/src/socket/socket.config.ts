import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://127.0.0.1:3030";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});
