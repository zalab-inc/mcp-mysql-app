import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTool, enhanceMcpServer } from "./libs/tool-utils.js";
import { MySQLCheckConnection, MySQLQuery } from "./tools/mysql-tool.js";

/**
 * Initialize and start the MCP server
 */
async function main(): Promise<void> {
  try {
    // Create server instance
    const server = new McpServer({
      name: "mcp-mysql-app",
      version: "0.0.1",
    });

    // Enable object-based tool registration
    enhanceMcpServer();

    // Register all tools
    registerTool(server, [
      MySQLCheckConnection,
      MySQLQuery,
    ]);

    // Connect to stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    // console.log("MCP Server running on stdio");
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

// Run the server
main();