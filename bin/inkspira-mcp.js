#!/usr/bin/env node
// Local stdio entry, for clients that launch MCP servers as a child process
// (npx inkspira-mcp). The hosted Streamable HTTP endpoint lives in server.js.
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { createServer } from '../tools.js';

const server = createServer();
await server.connect(new StdioServerTransport());
