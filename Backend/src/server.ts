import http from "http";
import app from "./app";
import { getDatabaseUrl } from "./config/db.URL";
import { ensureDatabaseExists } from "./utils/initDB";

const PORT = process.env.PORT || 3000;

process.env.DATABASE_URL = getDatabaseUrl();

const startServer = async () => {
  try {
    // Set DB URL
    process.env.DATABASE_URL = getDatabaseUrl();

    // Ensure DB exists
    await ensureDatabaseExists();

    // Create server
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log("http://localhost:" + PORT);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
