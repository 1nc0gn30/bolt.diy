export const MAX_BUILD_SEGMENTS = 6;
export const MAX_UNSTARTED_PASSES = 2;

export type ContinueGap = 'unclosed' | 'needs-start' | 'not-started';

function occurrences(text: string, token: string): number {
  return text.split(token).length - 1;
}

/*
 * A build is unfinished while tags are open, the dev server was never started,
 * or build mode produced no artifact. Discuss mode only continues for a cut-off tag.
 */
export function historyHasLiveSite(messages: Array<{ role?: string; content?: string }> | undefined): boolean {
  if (!messages?.length) {
    return false;
  }

  return messages.some(
    (message) =>
      message?.role === 'assistant' &&
      typeof message.content === 'string' &&
      /<boltAction\b[^>]*\btype=["']start["']/.test(message.content),
  );
}

/*
 * A second start action fights a running WebContainer. History alone is not
 * enough: after a reload the transcript still has a start tag but the
 * container is empty and needs one.
 */
export function resolveSiteAlreadyLive(options?: {
  previewLive?: boolean;
  workspaceFileCount?: number;
  messages?: Array<{ role?: string; content?: string }>;
}): boolean {
  if (options?.previewLive) {
    return true;
  }

  const files = options?.workspaceFileCount ?? 0;

  return files > 0 && historyHasLiveSite(options?.messages);
}

export function responseNeedsContinue(
  text: string,
  chatMode: 'discuss' | 'build',
  options?: { siteAlreadyLive?: boolean },
): ContinueGap | null {
  const body = text ?? '';
  const trimmed = body.trimEnd();
  const siteAlreadyLive = Boolean(options?.siteAlreadyLive);

  if (trimmed.endsWith('<') || /<[A-Za-z/!][^>\n]*$/.test(trimmed)) {
    return 'unclosed';
  }

  const artifactGap = occurrences(body, '<boltArtifact') - occurrences(body, '</boltArtifact>');
  const actionGap = occurrences(body, '<boltAction') - occurrences(body, '</boltAction>');

  if (artifactGap > 0 || actionGap > 0) {
    return 'unclosed';
  }

  if (chatMode !== 'build') {
    return null;
  }

  const hasArtifact = body.includes('<boltArtifact');
  const hasStart = /<boltAction\b[^>]*\btype=["']start["']/.test(body);

  if (hasArtifact && !hasStart) {
    /*
     * A follow-up after a live preview only needs to close files.
     * A second start action fights the already-running WebContainer server.
     */
    if (siteAlreadyLive) {
      return null;
    }

    return 'needs-start';
  }

  if (!hasArtifact) {
    if (siteAlreadyLive) {
      return null;
    }

    return 'not-started';
  }

  return null;
}
