import { describe, expect, it } from 'vitest';
import { historyHasLiveSite, resolveSiteAlreadyLive, responseNeedsContinue } from './response-continue';

const closedSite = `
<boltArtifact id="site" title="Site">
<boltAction type="file" filePath="index.html"><h1>Ready</h1></boltAction>
<boltAction type="start">npm run dev</boltAction>
</boltArtifact>
`;

describe('responseNeedsContinue', () => {
  it('continues a cut-off artifact in build mode', () => {
    expect(
      responseNeedsContinue(
        '<boltArtifact id="site" title="Site">\n<boltAction type="file" filePath="index.html">',
        'build',
      ),
    ).toBe('unclosed');
  });

  it('continues when the file is closed and the dev server was never started', () => {
    const text = `<boltArtifact id="site" title="Site"><boltAction type="file" filePath="index.html"><h1>Hi</h1></boltAction></boltArtifact>`;
    expect(responseNeedsContinue(text, 'build')).toBe('needs-start');
  });

  it('stops when the artifact is closed and the start action is present', () => {
    expect(responseNeedsContinue(closedSite, 'build')).toBeNull();
  });

  it('asks build mode to start when the model only wrote a plan', () => {
    expect(responseNeedsContinue('I will build the page next.', 'build')).toBe('not-started');
  });

  it('leaves a finished discuss answer alone', () => {
    expect(responseNeedsContinue('The page should use one accent.', 'discuss')).toBeNull();
  });

  it('continues discuss mode only when a tag is still open', () => {
    expect(responseNeedsContinue('<boltAction type="file" filePath="a.txt">hello', 'discuss')).toBe('unclosed');
  });

  it('does not demand a second start when the preview is already live', () => {
    const edit = `<boltArtifact id="edit" title="Edit"><boltAction type="file" filePath="index.html"><h1>Hi</h1></boltAction></boltArtifact>`;
    expect(responseNeedsContinue(edit, 'build', { siteAlreadyLive: true })).toBeNull();
    expect(responseNeedsContinue('Tweaked the headline.', 'build', { siteAlreadyLive: true })).toBeNull();
  });

  it('still continues an unclosed follow-up after a live site', () => {
    expect(
      responseNeedsContinue(
        '<boltArtifact id="edit" title="Edit">\n<boltAction type="file" filePath="index.html">',
        'build',
        { siteAlreadyLive: true },
      ),
    ).toBe('unclosed');
  });
});

describe('resolveSiteAlreadyLive', () => {
  const priorStart = [{ role: 'assistant', content: closedSite }];

  it('trusts a live preview', () => {
    expect(resolveSiteAlreadyLive({ previewLive: true, workspaceFileCount: 0, messages: [] })).toBe(true);
  });

  it('treats a workspace plus a prior start as live', () => {
    expect(resolveSiteAlreadyLive({ previewLive: false, workspaceFileCount: 4, messages: priorStart })).toBe(true);
  });

  it('does not skip start after a reload with history but no files', () => {
    expect(resolveSiteAlreadyLive({ previewLive: false, workspaceFileCount: 0, messages: priorStart })).toBe(false);
  });

  it('detects a start action in assistant history', () => {
    expect(historyHasLiveSite(priorStart)).toBe(true);
    expect(historyHasLiveSite([{ role: 'user', content: closedSite }])).toBe(false);
  });
});
