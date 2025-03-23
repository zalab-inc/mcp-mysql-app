import { z } from "zod";
import { createSafeTool, ToolResponse } from "../libs/tool-register.js";
import { createConnection } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();



const mysqlServer = createConnection({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "3307"),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});


/**
 * Check mysql connection
 */
export const MySQLCheckConnection = createSafeTool({
  name: "sql_check_connection",
  description: "Check mysql connection",
  schema: {},
  handler: async () : Promise<ToolResponse> => {
    try {
      const connection = await mysqlServer;
      if (!connection) {
        return {
          content: [
            {
              type: "text",
              text: "Mysql connection failed"
            }
          ],
          isError: true
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "Mysql connection successful"
          }
        ],
        isError: false
      };
    } catch (error: unknown) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          }
        ],
        isError: true
      };
    }
  }
});

/**
 * MySQL Tool implementation
 * Provides access to MySQL database operations through the MCP
 */
export const MySQLQuery = createSafeTool({
  name: "sql_query",
  description: "Executes operations against a MySQL database",
  schema: {
    query: z.string().describe("The mysql query to execute")
  },
  handler: async ({ query }: { query: string }) : Promise<ToolResponse> => {
    try {
      const connection = await mysqlServer;
      if (!query) {
        return {
          content: [
            {
              type: "text",
              text: "Query is required"
            }
          ],
          isError: true
        }
      }

      const result = await connection.query(query);
      const resultJsonPretty = JSON.stringify(result, null, 2);
      return {
        content: [
          {
            type: "text",
            text: `Query executed successfully\n\n${resultJsonPretty}`
          }
        ],
        isError: false
      };
    } catch (error: unknown) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          },
        ],
        isError: true
      };
    }
  }
});