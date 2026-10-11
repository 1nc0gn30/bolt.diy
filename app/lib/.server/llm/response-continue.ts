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
export function responseNeedsContinue(text: string, chatMode: 'discuss' | 'build'): ContinueGap | null {
  const body = text ?? '';
  const trimmed = body.trimEnd();

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
    return 'needs-start';
  }

  if (!hasArtifact) {
    return 'not-started';
  }

  return null;
}
