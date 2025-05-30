// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTool, enhanceMcpServer } from "./libs/tool-register.js";
import { AddTodoToPlan, AskWulang, CreatePlan, DoResearchOnUncertainty, DoTodo, GetAllPlans, GetDetailedPlan, ImprovePlan, ReportTodo, UpdateUncertaintyConfidence } from "./tools/plan.js";

/**
 * Initialize and start the MCP server
 */
async function main(): Promise<void> {
  try {
    // Create server instance
    const server = new McpServer({
      name: "mcp-planner",
      version: "0.0.1",
    });

    // Enable object-based tool registration
    enhanceMcpServer();

    // Register all tools
    registerTool(server, [
      AskWulang,
      CreatePlan,
      GetAllPlans,
      GetDetailedPlan,
      UpdateUncertaintyConfidence,
      DoResearchOnUncertainty,
      ImprovePlan,
      AddTodoToPlan,
      DoTodo,
      ReportTodo,
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