# MCP MySQL App

A Model Context Protocol (MCP) tools server implementation for interacting with MySQL databases through AI interfaces.

## Overview

This project provides a set of tools that allow AI systems to connect to and query MySQL databases through the Model Context Protocol. It enables AI assistants to execute SQL queries and check database connectivity.

## Features

- Simple but powerful MySQL tool integration
- Type-safe tool definitions
- Enhanced error handling
- Support for handling request abort signals
- Session awareness

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

## How to Use the Tool

### 1. Initial Setup

Clone this repository:
```bash
git clone <repository-url>
cd mcp-mysql-app
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the root directory:
```
MYSQL_HOST=your_mysql_host
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=your_database_name
MYSQL_PORT=3306
```

Build the project:
```bash
npm run build
```

The `dist` folder is now ready to be used for configuration in various AI platforms.

### 2. Cursor Configuration

Find your Cursor MCP configuration file:

- Windows: `C:\Users\<username>\.cursor\mcp.json`
- macOS: `~/.cursor/mcp.json`
- Linux: `~/.cursor/mcp.json`

Edit the file to add the MySQL MCP server configuration:

```json
{
  "mcpServers": {
    "mysql": {
      "command": "<path-to-node>",
      "args": [
        "<path-to-project>/dist/index.js"
      ],
      "env": {
        "MYSQL_HOST": "your_mysql_host",
        "MYSQL_USER": "your_mysql_username",
        "MYSQL_PASSWORD": "your_mysql_password",
        "MYSQL_DATABASE": "your_database_name",
        "MYSQL_PORT": "3306"
      }
    }
  }
}
```

Replace the placeholders:
- `<path-to-node>`: Path to your Node.js executable
- `<path-to-project>`: Absolute path to your MCP MySQL App project directory
- MySQL environment variables with your actual database connection details

Example configuration:

```json
{
  "mcpServers": {
    "mysql": {
      "command": "C:\\nvm4w\\nodejs\\node.exe",
      "args": [
        "H:\\mcp\\my-mysql\\dist\\index.js"
      ],
      "env": {
        "MYSQL_HOST": "localhost",
        "MYSQL_USER": "root",
        "MYSQL_PASSWORD": "password123",
        "MYSQL_DATABASE": "todo_app",
        "MYSQL_PORT": "3306"
      }
    }
  }
}
```

Save the file and restart Cursor for the changes to take effect.

### 3. Claude Configuration

To use MCP MySQL Tools with Claude, you need to add configuration to Claude's settings file. Follow these steps:

1. Open Claude AI desktop app settings
2. Navigate to the "Developer" section
3. Look for the "Tools" configuration section
4. Add configuration for MySQL MCP as follows:

```json
{
  "tools": {
    "mysql": {
      "command": "<path-to-node>",
      "args": [
        "<path-to-project>/dist/index.js"
      ],
      "env": {
        "MYSQL_HOST": "your_mysql_host",
        "MYSQL_USER": "your_mysql_username",
        "MYSQL_PASSWORD": "your_mysql_password",
        "MYSQL_DATABASE": "your_database_name",
        "MYSQL_PORT": "3306"
      }
    }
  }
}
```

Replace the placeholders:
- `<path-to-node>`: Path to your Node.js executable
- `<path-to-project>`: Absolute path to your MCP MySQL App project directory
- MySQL environment variables with your actual database connection details

Example configuration:

```json
{
  "tools": {
    "mysql": {
      "command": "/usr/local/bin/node",
      "args": [
        "/Users/username/projects/mcp-mysql-app/dist/index.js"
      ],
      "env": {
        "MYSQL_HOST": "localhost",
        "MYSQL_USER": "root",
        "MYSQL_PASSWORD": "password123",
        "MYSQL_DATABASE": "todo_app",
        "MYSQL_PORT": "3306"
      }
    }
  }
}
```

### 4. Configuration on Other Platforms

The basic principle is the same for other AI platforms that support MCP:

1. Find the configuration area for external tools or MCP
2. Configure it to run Node.js with the `dist/index.js` file from this repository
3. Include your MySQL connection details in the environment configuration

## Available Tools

After configuration, your AI will have access to the following MySQL tools:

- `sql_check_connection` - Check if the MySQL connection is working
- `sql_query` - Execute SQL queries on the connected database

## Using MySQL Tools in AI Environments

Once you've configured the MySQL tools in your AI environment, you can start using them by prompting the AI. Here are some examples:

### Using MySQL Tools in Cursor

In Cursor, you can simply ask Claude to perform MySQL-related tasks:

- Check if the MySQL connection is working.
- Show me all databases on the server.
- Get all tables from the current database.
- Execute a query to retrieve all users from the users table.
- Update a record in the products table.

### Example Workflow: Querying and Manipulating Data

Here's an example workflow showing how you might use these tools:

1. Checking connection:
   
   "Check if the MySQL connection is working."
   
   Claude will use the `sql_check_connection` tool to verify the database connection.

2. Viewing databases:
   
   "Show me all the databases on this MySQL server."
   
   Claude will use the `sql_query` tool with `SHOW DATABASES;`.

3. Exploring tables:
   
   "List all tables in the current database."
   
   Claude will use the `sql_query` tool with `SHOW TABLES;`.

4. Querying data:
   
   "Show me the first 10 records from the users table."
   
   Claude will use the `sql_query` tool with `SELECT * FROM users LIMIT 10;`.

5. Creating tables:
   
   "Create a new table named 'products' with columns for id, name, price, and description."
   
   Claude will use the `sql_query` tool to create the table with an appropriate CREATE TABLE statement.

6. Inserting data:
   
   "Insert a new product with the name 'Smartphone', price 499.99, and description 'Latest model'."
   
   Claude will use the `sql_query` tool with an INSERT statement.

7. Updating records:
   
   "Update the price of the 'Smartphone' product to 449.99."
   
   Claude will use the `sql_query` tool with an UPDATE statement.

These examples demonstrate how naturally you can interact with MySQL through your AI assistant once the tools are properly configured.

## Support and Help

If you experience problems using this tool, please:

- Check that your MySQL connection details are correct
- Make sure Node.js is properly installed
- Check your MCP configuration in your AI platform
- Check log files for any error messages that might appear
- Verify network connectivity to your MySQL server

## License

This project is licensed under the MIT License - see the LICENSE file for details.