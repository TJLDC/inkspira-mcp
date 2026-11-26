import assert from 'node:assert/strict';
import test from 'node:test';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import worker from './server.js';

test('MCP client discovers and calls the read-only tattoo planning tools', async () => {
  const url = new URL(process.env.MCP_TEST_URL ?? 'https://local.invalid/mcp');
  const options = process.env.MCP_TEST_URL ? {} : {
    fetch: (input, init) => worker.fetch(new Request(input, init)),
  };
  const client = new Client({ name: 'inkspira-test', version: '1.0.0' });
  try {
    await client.connect(new StreamableHTTPClientTransport(url, options));
    const { tools } = await client.listTools();
    assert.equal(tools.length, 3);
    assert.ok(tools.every(tool => tool.annotations.readOnlyHint));
    const choices = await client.callTool({ name: 'list_tattoo_options', arguments: {} });
    assert.ok(choices.structuredContent.styles.includes('Fine Line'));
    const preview = await client.callTool({
      name: 'create_tattoo_preview_link',
      arguments: { prompt: 'Fern & crescent', style: 'Fine Line', placement: 'Unterarm', color: 'sw' },
    });
    const link = new URL(preview.structuredContent.url);
    assert.equal(link.origin + link.pathname, 'https://inkspira.de/tattoo-generator/');
    assert.deepEqual(Object.fromEntries(link.searchParams), {
      prompt: 'Fern & crescent', style: 'Fine Line', placement: 'Unterarm', color: 'sw',
    });
    const invalid = await client.callTool({ name: 'create_tattoo_preview_link', arguments: { prompt: ' ' } });
    assert.equal(invalid.isError, true);
    const resources = await client.callTool({ name: 'list_tattoo_planning_resources', arguments: {} });
    assert.match(resources.structuredContent.printable_samples.url, /tattoo-vorlagen-zum-ausdrucken/);
    assert.match(resources.structuredContent.photo_try_on.url, /tattoo-simulator/);
  } finally {
    await client.close();
  }
});
