import http from "http";
import app from "./app";
import { getDatabaseUrl } from "./config/db.URL";
import { ensureDatabaseExists } from "./utils/initDB";
import { initializeSocket } from "./socket";

const PORT = Number(process.env.PORT) || 3000;

// =========================
// BOOTSTRAP SERVER
// =========================
const startServer = async (): Promise<void> => {
  try {
    // ✅ Set DATABASE URL (single source of truth)
    process.env.DATABASE_URL = getDatabaseUrl();

    // ✅ Ensure DB exists
    await ensureDatabaseExists();

    // ✅ Create HTTP server
    const server = http.createServer(app);

    // ✅ Initialize socket
    initializeSocket(server);
    console.log("🔥 Socket initialized");

    // ✅ Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

// =========================
// START
// =========================
startServer();
