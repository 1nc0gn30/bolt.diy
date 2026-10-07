import { spawn } from 'node:child_process';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { webGenBridge } from '~/lib/.server/webgen-bus';
import {
  FRAMEWORK_OPTIONS,
  UI_LIBRARIES,
  ANIMATION_LIBRARIES,
  COMMODITIES_AND_EFFECTS,
  TYPOGRAPHY_PAIRINGS,
  COLOR_PALETTES,
} from '~/lib/modules/design-libraries/catalog';
import { CURATED_PHOTOGRAPHY_PACKS } from '~/lib/modules/design-libraries/media-packs';

export async function loader({ request: _request }: LoaderFunctionArgs) {
  const state = webGenBridge.getState();
  const clients = webGenBridge.getClientCount();

  return json({
    status: 'ok',
    connectedClients: clients,
    isStreaming: state.isStreaming,
    previewUrl: state.previewUrl,
    activeChatId: state.activeChatId,
    fileCount: Object.keys(state.files).length,
    files: Object.keys(state.files),
    lastPrompt: state.lastPrompt,
    catalogSummary: {
      frameworks: FRAMEWORK_OPTIONS.length,
      uiLibraries: UI_LIBRARIES.length,
      animationLibraries: ANIMATION_LIBRARIES.length,
      commodities: COMMODITIES_AND_EFFECTS.length,
      typographyPairings: TYPOGRAPHY_PAIRINGS.length,
      palettes: COLOR_PALETTES.length,
      mediaPacks: CURATED_PHOTOGRAPHY_PACKS.length,
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json<any>();
    const actionType = body.action || body.type;

    switch (actionType) {
      case 'set_prompt': {
        const prompt = body.prompt || body.text || '';
        webGenBridge.updateState({ lastPrompt: prompt });
        webGenBridge.broadcast({ type: 'SET_PROMPT', prompt });

        return json({
          success: true,
          action: 'set_prompt',
          prompt,
          clientsNotified: webGenBridge.getClientCount(),
        });
      }

      case 'submit': {
        webGenBridge.broadcast({ type: 'SUBMIT' });

        return json({
          success: true,
          action: 'submit',
          clientsNotified: webGenBridge.getClientCount(),
        });
      }

      case 'prompt_and_build': {
        const prompt = body.prompt || body.text || '';
        const model = body.model;
        const provider = body.provider;
        const template = body.template || body.framework;

        webGenBridge.updateState({ lastPrompt: prompt });
        webGenBridge.broadcast({
          type: 'PROMPT_AND_BUILD',
          prompt,
          model,
          provider,
          template,
        });

        return json({
          success: true,
          action: 'prompt_and_build',
          prompt,
          model,
          provider,
          template,
          clientsNotified: webGenBridge.getClientCount(),
        });
      }

      case 'run_tool': {
        const tool = body.tool;
        const args = body.args || [];
        const rawCmd = body.command;
        const pipeToPrompt = Boolean(body.pipeToPrompt);
        const pipeAndBuild = Boolean(body.pipeAndBuild);
        const workingDir = body.cwd || process.cwd();
        const timeoutMs = Math.min(Number(body.timeout) || 45000, 120000);

        let commandToRun = '';

        if (rawCmd) {
          commandToRun = rawCmd;
        } else if (tool) {
          const joinedArgs = Array.isArray(args) ? args.join(' ') : String(args);
          commandToRun = `${tool} ${joinedArgs}`.trim();
        }

        if (!commandToRun) {
          return json({ error: 'Tool or command is required' }, { status: 400 });
        }

        const env = {
          HOME: process.env.HOME || '/home/zoth',
          USER: process.env.USER || 'zoth',
          ...process.env,
          PATH: `/home/zoth/.local/bin:/usr/local/bin:/usr/bin:/bin:${process.env.PATH || ''}`,
          TERM: 'xterm-256color',
        };

        const startTime = Date.now();

        let output = '';
        let exitCode = 0;

        try {
          output = await new Promise<string>((resolve, reject) => {
            const child = spawn('bash', ['-c', commandToRun], { cwd: workingDir, env });

            let stdoutData = '';
            let stderrData = '';

            (child as any).stdout?.on('data', (d: any) => {
              stdoutData += d.toString();
            });

            (child as any).stderr?.on('data', (d: any) => {
              stderrData += d.toString();
            });

            const timer = setTimeout(() => {
              (child as any).kill?.('SIGTERM');
              resolve(stdoutData || stderrData || `[Command timed out after ${timeoutMs / 1000}s]`);
            }, timeoutMs);

            (child as any).on?.('close', (code: number) => {
              clearTimeout(timer);
              exitCode = code;
              resolve(stdoutData || stderrData);
            });

            (child as any).on?.('error', (err: any) => {
              clearTimeout(timer);
              reject(err);
            });
          });
        } catch (err: any) {
          output = `Error executing tool: ${err.message}`;
          exitCode = 1;
        }

        const trimmedOutput = output.trim();

        if (pipeToPrompt && trimmedOutput) {
          webGenBridge.updateState({ lastPrompt: trimmedOutput });
          webGenBridge.broadcast({ type: 'SET_PROMPT', prompt: trimmedOutput });
        } else if (pipeAndBuild && trimmedOutput) {
          webGenBridge.updateState({ lastPrompt: trimmedOutput });
          webGenBridge.broadcast({ type: 'PROMPT_AND_BUILD', prompt: trimmedOutput });
        }

        return json({
          success: exitCode === 0,
          command: commandToRun,
          output: trimmedOutput,
          exitCode,
          durationMs: Date.now() - startTime,
          pipedToPrompt: pipeToPrompt || pipeAndBuild,
          clientsNotified: webGenBridge.getClientCount(),
        });
      }

      case 'select_framework': {
        const framework = body.framework || body.template || 'vite-react';
        webGenBridge.broadcast({ type: 'SET_FRAMEWORK', framework });

        return json({
          success: true,
          action: 'select_framework',
          framework,
          clientsNotified: webGenBridge.getClientCount(),
        });
      }

      case 'apply_design_preset': {
        const presetId = body.presetId;
        const scheme = body.scheme;
        webGenBridge.broadcast({ type: 'SET_DESIGN_SCHEME', presetId, scheme });

        return json({
          success: true,
          action: 'apply_design_preset',
          presetId,
          scheme,
          clientsNotified: webGenBridge.getClientCount(),
        });
      }

      case 'get_design_catalog': {
        const category = body.category;
        const query = (body.query || '').toLowerCase().trim();

        const filterItems = (list: any[]) => {
          if (!query) {
            return list;
          }

          return list.filter(
            (item) =>
              item.name.toLowerCase().includes(query) ||
              item.description?.toLowerCase().includes(query) ||
              item.tags?.some((t: string) => t.toLowerCase().includes(query)),
          );
        };

        const result: Record<string, any> = {
          success: true,
          stats: {
            frameworks: FRAMEWORK_OPTIONS.length,
            uiLibraries: UI_LIBRARIES.length,
            animationLibraries: ANIMATION_LIBRARIES.length,
            commodities: COMMODITIES_AND_EFFECTS.length,
            typographyPairings: TYPOGRAPHY_PAIRINGS.length,
            palettes: COLOR_PALETTES.length,
            mediaPacks: CURATED_PHOTOGRAPHY_PACKS.length,
          },
        };

        if (!category || category === 'frameworks') {
          result.frameworks = filterItems(FRAMEWORK_OPTIONS);
        }

        if (!category || category === 'ui') {
          result.uiLibraries = filterItems(UI_LIBRARIES);
        }

        if (!category || category === 'animation') {
          result.animationLibraries = filterItems(ANIMATION_LIBRARIES);
        }

        if (!category || category === 'commodities') {
          result.commodities = filterItems(COMMODITIES_AND_EFFECTS);
        }

        if (!category || category === 'typography') {
          result.typographyPairings = filterItems(TYPOGRAPHY_PAIRINGS);
        }

        if (!category || category === 'colors') {
          result.palettes = filterItems(COLOR_PALETTES);
        }

        if (!category || category === 'media') {
          result.mediaPacks = filterItems(CURATED_PHOTOGRAPHY_PACKS);
        }

        return json(result);
      }

      case 'insert_media_pack': {
        const industry = body.industry || 'general';
        const destination = body.destination || 'prompt';
        const assets = CURATED_PHOTOGRAPHY_PACKS.filter((p) => p.industry === industry || industry === 'general');

        webGenBridge.broadcast({
          type: 'INSERT_MEDIA_PACK',
          industry,
          destination,
          assets,
        });

        return json({
          success: true,
          action: 'insert_media_pack',
          industry,
          destination,
          assetCount: assets.length,
          clientsNotified: webGenBridge.getClientCount(),
        });
      }

      case 'sync_state': {
        const { files, isStreaming, previewUrl, activeChatId, lastPrompt } = body;

        webGenBridge.updateState({
          ...(files ? { files } : {}),
          ...(typeof isStreaming === 'boolean' ? { isStreaming } : {}),
          ...(previewUrl !== undefined ? { previewUrl } : {}),
          ...(activeChatId !== undefined ? { activeChatId } : {}),
          ...(lastPrompt ? { lastPrompt } : {}),
        });

        return json({ success: true });
      }

      case 'get_status': {
        const state = webGenBridge.getState();

        return json({
          success: true,
          connectedClients: webGenBridge.getClientCount(),
          isStreaming: state.isStreaming,
          previewUrl: state.previewUrl,
          activeChatId: state.activeChatId,
          fileCount: Object.keys(state.files).length,
          files: Object.keys(state.files),
          lastPrompt: state.lastPrompt,
        });
      }

      case 'list_files': {
        const state = webGenBridge.getState();

        return json({
          success: true,
          files: Object.keys(state.files),
          count: Object.keys(state.files).length,
        });
      }

      case 'read_file': {
        const filePath = body.path || body.filePath;
        const state = webGenBridge.getState();
        const file = state.files[filePath];

        if (!file) {
          return json(
            {
              success: false,
              error: `File not found: ${filePath}`,
              availableFiles: Object.keys(state.files),
            },
            { status: 404 },
          );
        }

        return json({
          success: true,
          path: filePath,
          content: file.content,
        });
      }

      case 'write_file': {
        const filePath = body.path || body.filePath;
        const content = body.content || '';

        webGenBridge.broadcast({
          type: 'WRITE_FILE',
          path: filePath,
          content,
        });

        return json({
          success: true,
          path: filePath,
          clientsNotified: webGenBridge.getClientCount(),
        });
      }

      default:
        return json({ error: `Unknown action: ${actionType}` }, { status: 400 });
    }
  } catch (error: any) {
    return json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
