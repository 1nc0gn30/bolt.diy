import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { webGenBridge } from '~/lib/.server/webgen-bus';

export async function loader({ request }: LoaderFunctionArgs) {
  const clientId = `client_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  let closeStream: (() => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: string) => {
        controller.enqueue(new TextEncoder().encode(data));
      };

      const close = () => {
        try {
          controller.close();
        } catch {
          // Stream already closed
        }
      };

      closeStream = close;

      webGenBridge.addClient(clientId, { id: clientId, send, close });

      // Send initial keepalive
      send(`: connected\n\n`);

      // Keepalive interval
      const timer = setInterval(() => {
        try {
          send(`: ping\n\n`);
        } catch {
          clearInterval(timer);
          webGenBridge.removeClient(clientId);
        }
      }, 15000);

      request.signal.addEventListener('abort', () => {
        clearInterval(timer);
        webGenBridge.removeClient(clientId);
        close();
      });
    },
    cancel() {
      if (closeStream) {
        closeStream();
      }

      webGenBridge.removeClient(clientId);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
