import { json, type ActionFunction } from '@remix-run/cloudflare';

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  return json(
    {
      error: 'Updates must be performed manually in a server environment',
      instructions: [
        '1. Navigate to the project directory',
        '2. Run: git pull (from your ZOTHOS WebGen repository)',
        '3. Run: pnpm install',
        '4. Run: pnpm run build',
      ],
    },
    { status: 400 },
  );
};
