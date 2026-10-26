#!/usr/bin/env node

/**
 * Zoth WebGen MCP Server
 * Model Context Protocol (MCP) JSON-RPC 2.0 Server over stdio
 * Allows any AI agent (Antigravity, Claude Code, Hermes Agent, Cursor)
 * to control Zoth WebGen via standard MCP tool calls.
 *
 * Creator: Neal Frazier Tech (@1nc0gn30) • NullAI Platform
 */

import readline from 'readline';

const WEBGEN_BASE_URL = process.env.WEBGEN_URL || 'http://localhost:5173';

const TOOLS = [
  {
    name: 'webgen_set_prompt',
    description: 'Types a prompt into the active Zoth WebGen browser interface without immediately submitting.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'The natural language prompt describing what to build or modify.',
        },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'webgen_trigger_submit',
    description: 'Triggers the execute/submit prompt button in Zoth WebGen to start synthesis.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'webgen_prompt_and_build',
    description: 'Types prompt and launches autonomous application synthesis in Zoth WebGen in one step.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'The complete prompt describing the application, UI, components, or feature to build.',
        },
        model: {
          type: 'string',
          description: 'Optional AI model (e.g., "agy-engine", "gemini-2.0-flash", "qwen2.5-coder:1.5b", "claude-cli", "hermes-agent").',
        },
        provider: {
          type: 'string',
          description: 'Optional provider name (e.g., "ZothLocal", "Google", "Anthropic", "OpenAI", "Ollama").',
        },
        framework: {
          type: 'string',
          description: 'Optional framework architecture: "astro", "vite-react", "vanilla-js", "html-css-js".',
        },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'webgen_run_tool',
    description: 'Executes ZothOS host AI tools (Antigravity agy, Nous Hermes, Claude Code, Ollama, bash) with optional piping of the output directly into the WebGen chat prompt.',
    inputSchema: {
      type: 'object',
      properties: {
        tool: {
          type: 'string',
          description: 'Host tool binary name: "agy", "hermes", "claude", "ollama", "git", or "bash".',
        },
        command: {
          type: 'string',
          description: 'Full command string if not using tool+args (e.g. "agy models" or "hermes -z \\"build spec\\"").',
        },
        args: {
          type: 'array',
          items: { type: 'string' },
          description: 'Arguments array (e.g. ["-p", "write design spec", "--output-format", "json"]).',
        },
        pipeToPrompt: {
          type: 'boolean',
          description: 'If true, injects stdout/stderr directly into active WebGen prompt textarea in browser.',
        },
        pipeAndBuild: {
          type: 'boolean',
          description: 'If true, injects output into WebGen prompt AND immediately executes autonomous synthesis.',
        },
        cwd: {
          type: 'string',
          description: 'Optional working directory path.',
        },
      },
    },
  },
  {
    name: 'webgen_select_framework',
    description: 'Selects the framework architecture in Zoth WebGen (Astro 5+, Vite React 19, Vanilla JS, Zero-Build HTML5+CSS3+JS, Next.js, etc.).',
    inputSchema: {
      type: 'object',
      properties: {
        framework: {
          type: 'string',
          description: 'Framework ID: "astro", "vite-react", "vanilla-js", "html-css-js", "nextjs", "sveltekit", "solidjs", "vue".',
        },
      },
      required: ['framework'],
    },
  },
  {
    name: 'webgen_apply_design_preset',
    description: 'Applies an avant-garde design system preset or custom scheme (Imperial Gold, Solana Emerald, Tokyo Night, Nordic Frost, Acid Lime, etc.).',
    inputSchema: {
      type: 'object',
      properties: {
        presetId: {
          type: 'string',
          description: 'Studio Preset ID: "imperial-gold", "solana-emerald", "cyberpunk-neon", "tokyo-night", "nordic-frost", "minimal-monochrome", "acid-lime".',
        },
        scheme: {
          type: 'object',
          description: 'Custom scheme properties (framework, uiLibrary, animationLibrary, commodities, typographyPairing, palette).',
        },
      },
    },
  },
  {
    name: 'webgen_get_design_catalog',
    description: 'Retrieves the catalog of 380+ frameworks, UI design systems, motion engines, visual commodities, typography pairings, and media packs.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Optional category filter: "frameworks", "ui", "animation", "commodities", "typography", "colors", "media".',
        },
        query: {
          type: 'string',
          description: 'Optional search keyword (e.g. "three.js", "syne", "astro", "luxury").',
        },
      },
    },
  },
  {
    name: 'webgen_insert_media_pack',
    description: 'Injects verified high-resolution photography collections (Unsplash CDNs), Web Audio synthetic sound effects, or vector icon suites for an industry into the active prompt or workspace.',
    inputSchema: {
      type: 'object',
      properties: {
        industry: {
          type: 'string',
          description: 'Industry pack: "luxury", "saas", "trades", "fintech", "editorial", "general".',
        },
        destination: {
          type: 'string',
          enum: ['prompt', 'workspace'],
          description: 'Target location: "prompt" appends asset references to chat input; "workspace" writes a media-manifest.json to WebContainer.',
        },
      },
      required: ['industry'],
    },
  },
  {
    name: 'webgen_get_status',
    description: 'Retrieves current live status of Zoth WebGen (connected browser tabs, streaming state, file count, active preview URL, last prompt).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'webgen_list_files',
    description: 'Lists all files currently generated and present in the active WebContainer workspace.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'webgen_read_file',
    description: 'Reads the source code content of a specific file in the Zoth WebGen workspace.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative path of the file to read (e.g. "src/App.tsx", "package.json").',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'webgen_write_file',
    description: 'Injects or modifies a file directly in the active Zoth WebGen WebContainer workspace.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative path of the file to write (e.g. "src/components/Header.tsx").',
        },
        content: {
          type: 'string',
          description: 'Full code contents to write to the file.',
        },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'webgen_get_preview_url',
    description: 'Gets the active live in-browser preview URL and port of the running application.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'zoth_bolt_search_free_icons',
    description:
      'Searches 200,000+ free vector and 8-bit pixel-art SVG icons from Iconify (pixelarticons, lucide, ph, game-icons, simple-icons) plus DiceBear pixel-art sprites.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search keyword (e.g. "bolt", "sword", "shield", "terminal", "robot", "coin").',
        },
        collection: {
          type: 'string',
          description: 'Collection filter: "pixelarticons", "lucide", "ph", "game-icons", "simple-icons", or "all".',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'zoth_bolt_get_svg_pixel_library',
    description:
      'Retrieves the built-in Zoth Bolt library of 16x16 inline Pixel Art SVGs, multi-layered Vector SVG Crests, WebAudio SFX synthesizers, and free external media asset endpoints.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'zoth_bolt_list_motion_templates',
    description:
      'Lists all 6 production Motion Edit & Uncommon Web Shader templates (15s Claude Motion Showreel, @teknium Braille/Dither/ASCII Shader, 16-bit Pixel Art CRT Arcade, Isometric Scroll Choreography, Hermes Commerce Drop, Sovereign SaaS Funnel).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'zoth_bolt_deconstruct_live_url',
    description:
      'Deconstructs any live public URL into its headings, navigation structure, dominant hex color palette, font families, and AEO readiness, returning a ready-to-run Zoth Bolt redesign blueprint.',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'Live website URL to analyze and remix (e.g. "https://linear.app", "https://zoth.nullai.tech").',
        },
      },
      required: ['url'],
    },
  },
  {
    name: 'zoth_bolt_self_critique_and_polish',
    description:
      'Runs the Zoth Bolt Design Director 100-point rubric against an HTML/app string (scoring Hierarchy, Responsiveness, Visual Craft, Interactivity, and AEO/Conversion) and optionally returns auto-polished HTML with fluid clamp() typography and overflow guards.',
    inputSchema: {
      type: 'object',
      properties: {
        html: {
          type: 'string',
          description: 'HTML document string to score and polish.',
        },
        autoPolish: {
          type: 'boolean',
          description: 'If true, returns auto-polished HTML alongside the 100-point score.',
        },
      },
      required: ['html'],
    },
  },
];

async function callWebGen(action, payload = {}) {
  try {
    const res = await fetch(`${WEBGEN_BASE_URL}/api/webgen/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { error: `HTTP ${res.status}: ${err}` };
    }

    return await res.json();
  } catch (error) {
    return {
      error: `Failed to connect to Zoth WebGen on ${WEBGEN_BASE_URL}: ${error.message}. Ensure the dev server is running!`,
    };
  }
}

async function handleToolCall(name, args) {
  switch (name) {
    case 'webgen_set_prompt': {
      const result = await callWebGen('set_prompt', { prompt: args.prompt });
      return JSON.stringify(result, null, 2);
    }

    case 'webgen_trigger_submit': {
      const result = await callWebGen('submit');
      return JSON.stringify(result, null, 2);
    }

    case 'webgen_prompt_and_build': {
      const result = await callWebGen('prompt_and_build', {
        prompt: args.prompt,
        model: args.model,
        provider: args.provider,
        template: args.framework,
      });
      return JSON.stringify(result, null, 2);
    }

    case 'webgen_run_tool': {
      const result = await callWebGen('run_tool', {
        tool: args.tool,
        command: args.command,
        args: args.args,
        pipeToPrompt: args.pipeToPrompt,
        pipeAndBuild: args.pipeAndBuild,
        cwd: args.cwd,
      });
      return JSON.stringify(result, null, 2);
    }

    case 'webgen_select_framework': {
      const result = await callWebGen('select_framework', {
        framework: args.framework,
      });
      return JSON.stringify(result, null, 2);
    }

    case 'webgen_apply_design_preset': {
      const result = await callWebGen('apply_design_preset', {
        presetId: args.presetId,
        scheme: args.scheme,
      });
      return JSON.stringify(result, null, 2);
    }

    case 'webgen_get_design_catalog': {
      const result = await callWebGen('get_design_catalog', {
        category: args.category,
        query: args.query,
      });
      return JSON.stringify(result, null, 2);
    }

    case 'webgen_insert_media_pack': {
      const result = await callWebGen('insert_media_pack', {
        industry: args.industry,
        destination: args.destination || 'prompt',
      });
      return JSON.stringify(result, null, 2);
    }

    case 'webgen_get_status': {
      const result = await callWebGen('get_status');
      return JSON.stringify(result, null, 2);
    }

    case 'webgen_list_files': {
      const result = await callWebGen('list_files');
      return JSON.stringify(result, null, 2);
    }

    case 'webgen_read_file': {
      const result = await callWebGen('read_file', { path: args.path });
      return JSON.stringify(result, null, 2);
    }

    case 'webgen_write_file': {
      const result = await callWebGen('write_file', {
        path: args.path,
        content: args.content,
      });
      return JSON.stringify(result, null, 2);
    }

    case 'webgen_get_preview_url': {
      const result = await callWebGen('get_status');
      if (result.previewUrl) {
        return JSON.stringify({
          previewUrl: result.previewUrl,
          message: 'Preview is running and accessible in browser.',
        });
      }
      return JSON.stringify({
        previewUrl: null,
        message: 'No active preview server is running yet. Prompt the app to generate and start dev server.',
      });
    }

    case 'zoth_bolt_search_free_icons': {
      const result = await callWebGen('search_free_icons', {
        query: args.query,
        collection: args.collection || 'pixelarticons',
      });
      return JSON.stringify(result, null, 2);
    }

    case 'zoth_bolt_get_svg_pixel_library': {
      const result = await callWebGen('get_svg_pixel_library');
      return JSON.stringify(result, null, 2);
    }

    case 'zoth_bolt_list_motion_templates': {
      const result = await callWebGen('list_motion_templates');
      return JSON.stringify(result, null, 2);
    }

    case 'zoth_bolt_deconstruct_live_url': {
      const res = await fetch(`${WEBGEN_BASE_URL}/api/zoth/url-blueprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: args.url || 'https://zoth.nullai.tech' }),
      });
      const data = await res.json();
      return JSON.stringify(data, null, 2);
    }

    case 'zoth_bolt_self_critique_and_polish': {
      const res = await fetch(`${WEBGEN_BASE_URL}/api/zoth/self-critique`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: args.html || '', autoPolish: Boolean(args.autoPolish) }),
      });
      const data = await res.json();
      return JSON.stringify(data, null, 2);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// JSON-RPC stdio protocol loop
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', async (line) => {
  if (!line.trim()) return;

  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    if (method === 'initialize') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'zoth-webgen-mcp',
            version: '2.0.0',
            creator: 'Neal Frazier Tech (@1nc0gn30)',
          },
        },
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    if (method === 'notifications/initialized') {
      // Notification, no reply needed
      return;
    }

    if (method === 'ping') {
      process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result: {} }) + '\n');
      return;
    }

    if (method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          tools: TOOLS,
        },
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    if (method === 'tools/call') {
      const { name, arguments: args } = params || {};
      try {
        const textResult = await handleToolCall(name, args || {});
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: textResult,
              },
            ],
            isError: false,
          },
        };
        process.stdout.write(JSON.stringify(response) + '\n');
      } catch (err) {
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: `Error: ${err.message}`,
              },
            ],
            isError: true,
          },
        };
        process.stdout.write(JSON.stringify(response) + '\n');
      }
      return;
    }

    // Default unhandled method
    process.stdout.write(
      JSON.stringify({
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` },
      }) + '\n',
    );
  } catch (err) {
    // Malformed JSON
  }
});
