import "reflect-metadata";
import { initializeDatabase } from "./config";

// Initialize database connection
initializeDatabase().catch((error) => {
  console.error("❌ Database connection failed:", error);
  process.exit(1);
});