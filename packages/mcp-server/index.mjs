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
      },
      required: ['prompt'],
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
            version: '1.0.0',
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
