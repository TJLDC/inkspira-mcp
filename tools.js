import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

export const website = 'https://inkspira.de';
export const styles = [
  'Fine Line', 'Minimalistisch', 'Blackwork', 'Dotwork', 'Old School', 'Aquarell',
  'Geometrisch', 'Maori / Tribal', 'Japanisch', 'Realistisch', 'Chicano', 'Lettering',
  'Mandala', 'Sketch', 'Trash Polka', 'Neo-Traditional', 'New School', 'Anime',
  'Biomechanical', 'Ignorant Style', 'Surrealismus',
];
export const placements = [
  'Arm', 'Unterarm', 'Ärmel (Sleeve)', 'Finger', 'Hand',
  'Nacken', 'Rücken', 'Bein', 'Schulter', 'Brust',
];
export const colors = { sw: 'Black and white', farbig: 'Color' };
export const resources = {
  printable_samples: {
    url: website + '/tattoo-vorlagen-zum-ausdrucken/',
    description: 'Six printable A4 examples with 3 cm and 5 cm sizes, available without signing in.',
  },
  photo_try_on: {
    url: website + '/tattoo-simulator/',
    description: 'Preview placement on a photo. The manual overlay is available without signing in.',
  },
};

const readOnly = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

function result(value) {
  return {
    content: [{ type: 'text', text: JSON.stringify(value) }],
    structuredContent: value,
  };
}

// Shared by the remote Worker (server.js) and the local stdio entry (bin/inkspira-mcp.js).
export function createServer() {
  const server = new McpServer({
    name: 'inkspira-mcp',
    version: '1.0.0',
    websiteUrl: website + '/tattoo-generator/',
  });

  server.registerTool('list_tattoo_options', {
    title: 'List tattoo preview options',
    description: 'Return the style, placement and color identifiers accepted by the Inkspira generator.',
    inputSchema: z.object({}),
    annotations: readOnly,
  }, () => result({ styles, placements, colors }));

  server.registerTool('create_tattoo_preview_link', {
    title: 'Prepare a tattoo preview link',
    description: 'Build a prefilled Inkspira generator link from a non-identifying tattoo motif. The link opens a form for review. Image generation happens only after the user signs in and chooses to generate. Do not send names, exact personal dates, contact details, image URLs, or other identifying details.',
    inputSchema: z.object({
      prompt: z.string().trim().min(1).max(300).describe('Tattoo motif and composition without identifying details.'),
      style: z.enum(styles).optional(),
      placement: z.enum(placements).optional(),
      color: z.enum(['sw', 'farbig']).optional(),
    }),
    annotations: readOnly,
  }, ({ prompt, style, placement, color }) => {
    const url = new URL('/tattoo-generator/', website);
    url.searchParams.set('prompt', prompt);
    if (style) url.searchParams.set('style', style);
    if (placement) url.searchParams.set('placement', placement);
    if (color) url.searchParams.set('color', color);
    return result({ url: url.href });
  });

  server.registerTool('list_tattoo_planning_resources', {
    title: 'Find tattoo planning resources',
    description: 'Return the public Inkspira links for actual-size printable examples and the photo placement preview.',
    inputSchema: z.object({}),
    annotations: readOnly,
  }, () => result(resources));

  return server;
}
