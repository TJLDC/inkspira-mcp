import { createMcpHandler } from '@modelcontextprotocol/server';
import { createServer } from './tools.js';

export const handler = createMcpHandler(createServer);

export default {
  fetch(request) {
    if (new URL(request.url).pathname === '/mcp') return handler.fetch(request);
    return new Response('Inkspira MCP endpoint: /mcp\n', {
      status: new URL(request.url).pathname === '/' ? 200 : 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  },
};
