import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy, vitePlugin as remixVitePlugin } from '@remix-run/dev';
import UnoCSS from 'unocss/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

// Load environment variables from multiple files
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
dotenv.config();

export default defineConfig((config) => {
  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
    build: {
      target: 'esnext',
    },
    optimizeDeps: {
      include: [
        'react-markdown',
        'remark-gfm',
        'rehype-raw',
        'shiki',
        'react-resizable-panels',
        'react-window',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-dialog',
        '@radix-ui/react-label',
        '@radix-ui/react-tooltip',
        '@radix-ui/react-tabs',
        '@radix-ui/react-switch',
        '@codemirror/autocomplete',
        '@codemirror/commands',
        '@codemirror/language',
        '@codemirror/search',
        '@codemirror/state',
        '@codemirror/view',
        '@lezer/highlight',
        '@nanostores/react',
        'nanostores',
        'framer-motion',
        'lucide-react',
        'clsx',
        'tailwind-merge',
        'diff',
        'file-saver',
        'jszip',
        'js-cookie',
        'react-toastify',
        'zustand',
        '@webcontainer/api',
        'isomorphic-git',
        'isomorphic-git/http/web',
        '@ai-sdk/openai',
        '@ai-sdk/google',
        '@ai-sdk/anthropic',
        '@ai-sdk/amazon-bedrock',
        '@ai-sdk/cerebras',
        '@ai-sdk/cohere',
        '@ai-sdk/deepseek',
        '@ai-sdk/fireworks',
        '@ai-sdk/mistral',
        '@openrouter/ai-sdk-provider',
        'ollama-ai-provider',
        '@codemirror/lang-cpp',
        '@codemirror/lang-css',
        '@codemirror/lang-html',
        '@codemirror/lang-javascript',
        '@codemirror/lang-json',
        '@codemirror/lang-markdown',
        '@codemirror/lang-python',
        '@codemirror/lang-sass',
        '@codemirror/lang-vue',
        '@codemirror/lang-wast',
        '@uiw/codemirror-theme-vscode',
        '@radix-ui/react-collapsible',
        '@radix-ui/react-context-menu',
        '@radix-ui/react-popover',
        '@radix-ui/react-scroll-area',
        '@xterm/addon-fit',
        '@xterm/addon-web-links',
        '@xterm/xterm',
        'chart.js',
        'class-variance-authority',
        'date-fns',
        'istextorbinary',
        'jspdf',
        'path-browserify',
        'react-chartjs-2',
        'react-icons/bi',
        'react-icons/bs',
        'react-icons/fa',
        'react-icons/si',
        'react-icons/tb',
        'react-qrcode-logo',
        'rehype-sanitize',
        'unist-util-visit',
        'vite-plugin-node-polyfills/shims/process',
        'react-dnd',
        'react-dnd-html5-backend',
        'remix-island',
        'remix-utils/client-only'
      ],
    },
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      warmup: {
        clientFiles: [
          './app/root.tsx',
          './app/routes/**/*.tsx'
        ],
      },
    },
    plugins: [
      nodePolyfills({
        include: ['buffer', 'process', 'util', 'stream'],
        globals: {
          Buffer: true,
          process: true,
          global: true,
        },
        protocolImports: true,
        exclude: ['child_process', 'fs', 'path'],
      }),
      {
        name: 'buffer-polyfill',
        transform(code, id) {
          if (id.includes('env.mjs')) {
            return {
              code: `import { Buffer } from 'buffer';\n${code}`,
              map: null,
            };
          }

          return null;
        },
      },
      config.mode !== 'test' && remixCloudflareDevProxy(),
      remixVitePlugin({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_lazyRouteDiscovery: true,
        },
      }),
      UnoCSS(),
      tsconfigPaths(),
      zothDepsMimeGuardPlugin(),
      chrome129IssuePlugin(),
      config.mode === 'production' && optimizeCssModules({ apply: 'build' }),
    ],
    envPrefix: [
      'VITE_',
      'OPENAI_LIKE_API_BASE_URL',
      'OPENAI_LIKE_API_MODELS',
      'OLLAMA_API_BASE_URL',
      'LMSTUDIO_API_BASE_URL',
      'TOGETHER_API_BASE_URL',
    ],
    test: {
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/cypress/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/tests/preview/**', // Exclude preview tests that require Playwright
        '**/tests/e2e/**', // Exclude e2e tests that require Playwright
      ],
    },
  };
});

function zothDepsMimeGuardPlugin() {
  return {
    name: 'zothDepsMimeGuardPlugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/node_modules/.vite/deps/')) {
          const cleanPath = req.url.split('?')[0];
          const fileName = path.basename(cleanPath);
          const viteDir = path.resolve(process.cwd(), 'node_modules/.vite');
          const primaryFile = path.join(viteDir, 'deps', fileName);

          let resolvedFile: string | null = null;
          if (fs.existsSync(primaryFile)) {
            resolvedFile = primaryFile;
          } else if (fs.existsSync(viteDir)) {
            const entries = fs.readdirSync(viteDir);
            for (const entry of entries) {
              if (entry.startsWith('deps')) {
                const candidate = path.join(viteDir, entry, fileName);
                if (fs.existsSync(candidate)) {
                  resolvedFile = candidate;
                  break;
                }
              }
            }
          }

          if (resolvedFile) {
            const isMap = fileName.endsWith('.map');
            res.statusCode = 200;
            res.setHeader(
              'Content-Type',
              isMap ? 'application/json; charset=utf-8' : 'application/javascript; charset=utf-8',
            );
            res.setHeader('Cache-Control', 'no-cache');
            res.end(fs.readFileSync(resolvedFile));
            return;
          }
        }
        next();
      });
    },
  };
}

function chrome129IssuePlugin() {
  return {
    name: 'chrome129IssuePlugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const raw = req.headers['user-agent']?.match(/Chrom(e|ium)\/([0-9]+)\./);

        if (raw) {
          const version = parseInt(raw[2], 10);

          if (version === 129) {
            res.setHeader('content-type', 'text/html');
            res.end(
              '<body><h1>Please use Chrome Canary or latest Chrome for testing.</h1><p>Chrome 129 had an upstream issue with JavaScript modules & Vite local development.</p><p><b>Note:</b> This only impacts <u>local development</u>. `pnpm run build` and `pnpm run start` will work fine in this browser.</p></body>',
            );

            return;
          }
        }

        next();
      });
    },
  };
}
