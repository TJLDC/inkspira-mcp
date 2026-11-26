import assert from 'node:assert/strict';
import test from 'node:test';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

// Exercises the entry point that `npx inkspira-mcp` runs.
test('stdio entry exposes the same three read-only tools', async () => {
  const client = new Client({ name: 'inkspira-stdio-test', version: '1.0.0' });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ['bin/inkspira-mcp.js'],
  });
  try {
    await client.connect(transport);
    const { tools } = await client.listTools();
    assert.deepEqual(tools.map(tool => tool.name).sort(), [
      'create_tattoo_preview_link',
      'list_tattoo_options',
      'list_tattoo_planning_resources',
    ]);
    const preview = await client.callTool({
      name: 'create_tattoo_preview_link',
      arguments: { prompt: 'Fine-line fern', style: 'Fine Line', color: 'sw' },
    });
    assert.equal(
      preview.structuredContent.url,
      'https://inkspira.de/tattoo-generator/?prompt=Fine-line+fern&style=Fine+Line&color=sw',
    );
  } finally {
    await client.close();
  }
});
