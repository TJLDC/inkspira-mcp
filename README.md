# Inkspira MCP

A read-only tattoo planning server for finding printable sizing samples, opening a photo placement preview, and preparing a prefilled generator link.

| Tool | Purpose |
| --- | --- |
| `list_tattoo_options` | Returns the supported style, placement and color values. |
| `create_tattoo_preview_link` | Builds a generator URL from a tattoo motif and optional selections. |
| `list_tattoo_planning_resources` | Returns the A4 size samples and the photo placement preview. |

Use Streamable HTTP at the endpoint in [server.json](server.json). The server needs no credentials. The preview tool constructs a URL locally and neither creates artwork nor fetches user images. Keep personal information out of the prompt because query parameters can appear in browser history when visitors open the link.

Explore the [Inkspira tattoo generator](https://inkspira.de/tattoo-generator/) and the free [A4 tattoo print samples](https://inkspira.de/tattoo-vorlagen-zum-ausdrucken/).

Run `npm ci` and `npm test` locally. Set `MCP_TEST_URL` to test a deployed endpoint. Licensed under [MIT](LICENSE).
