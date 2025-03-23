import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Prevent multiple instances of Prisma Client in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create Prisma client with explicit connection URL
export const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: "mysql://root:root@localhost:3307/mcp_planner"
    }
  }
});

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}



