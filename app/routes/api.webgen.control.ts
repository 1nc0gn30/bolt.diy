import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { webGenBridge } from '~/lib/.server/webgen-bus';

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
        const template = body.template;

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
