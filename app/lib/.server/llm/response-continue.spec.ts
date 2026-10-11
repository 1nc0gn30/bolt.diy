import { describe, expect, it } from 'vitest';
import { responseNeedsContinue } from './response-continue';

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
});
