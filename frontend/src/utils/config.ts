// src/config.ts
export const API_URL =
  import.meta.env.VITE_BACKEND_URL+"/api" || "/api";

export const SOCKET_URL =
  import.meta.env.VITE_BACKEND_WS_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "/socket.io";
