import ignore from 'ignore';

// Common patterns to ignore, similar to .gitignore
export const IGNORE_PATTERNS = [
  'node_modules/**',
  '.git/**',
  'dist/**',
  'build/**',
  '.next/**',
  'coverage/**',
  '.cache/**',
  '.vscode/**',
  '.idea/**',
  '**/*.log',
  '**/.DS_Store',
  '**/npm-debug.log*',
  '**/yarn-debug.log*',
  '**/yarn-error.log*',
];

export const MAX_FILES = 1000;
export const ig = ignore().add(IGNORE_PATTERNS);

export const generateId = () => Math.random().toString(36).substring(2, 15);

export const isBinaryFile = async (file: File): Promise<boolean> => {
  const chunkSize = 1024;
  const buffer = new Uint8Array(await file.slice(0, chunkSize).arrayBuffer());

  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];

    if (byte === 0 || (byte < 32 && byte !== 9 && byte !== 10 && byte !== 13)) {
      return true;
    }
  }

  return false;
};

export const shouldIncludeFile = (path: string): boolean => {
  return !ig.ignores(path);
};

const readPackageJson = async (files: File[]): Promise<{ scripts?: Record<string, string> } | null> => {
  const packageJsonFile = files.find((f) => f.webkitRelativePath.endsWith('package.json'));

  if (!packageJsonFile) {
    return null;
  }

  try {
    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(packageJsonFile);
    });

    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading package.json:', error);
    return null;
  }
};

export const detectProjectType = async (
  files: File[],
): Promise<{ type: string; setupCommand: string; followupMessage: string }> => {
  const hasFile = (name: string) => files.some((f) => f.webkitRelativePath.endsWith(name));

  if (hasFile('package.json')) {
    const packageJson = await readPackageJson(files);
    const scripts = packageJson?.scripts || {};

    // Check for preferred commands in priority order
    const preferredCommands = ['dev', 'start', 'preview'];
    const availableCommand = preferredCommands.find((cmd) => scripts[cmd]);

    if (availableCommand) {
      return {
        type: 'Node.js',
        setupCommand: `npm install && npm run ${availableCommand}`,
        followupMessage: `Found "${availableCommand}" script in package.json. Running "npm run ${availableCommand}" after installation.`,
      };
    }

    return {
      type: 'Node.js',
      setupCommand: 'npm install',
      followupMessage:
        'Would you like me to inspect package.json to determine the available scripts for running this project?',
    };
  }

  if (hasFile('index.html')) {
    return {
      type: 'Static',
      setupCommand: 'npx --yes serve',
      followupMessage: '',
    };
  }

  return { type: '', setupCommand: '', followupMessage: '' };
};

const SKIP_PATH = /(?:^|\/)(node_modules|\.git|dist|build|\.cache|coverage)(?:\/|$)/;
const SKIP_EXT = /\.(png|jpe?g|gif|webp|ico|bmp|pdf|zip|woff2?|ttf|eot|mp4|webm|mp3|wasm)$/i;
const MAX_FOLLOWUP_FILE_CHARS = 8000;
const MAX_FOLLOWUP_TOTAL_CHARS = 24000;

function isSkippablePath(filePath: string): boolean {
  return SKIP_PATH.test(filePath) || SKIP_EXT.test(filePath);
}

/**
 * Compact workspace note for a follow-up. Full file bodies already travel in
 * the request `files` map. A second boltArtifact here used to re-trigger the
 * parser and blow the token budget after a site was already built.
 */
export const filesToArtifacts = (files: { [path: string]: { content: string } }, id: string): string => {
  const paths = Object.keys(files).filter((filePath) => !isSkippablePath(filePath));

  if (paths.length === 0) {
    return '';
  }

  let used = 0;
  const excerpts: string[] = [];

  for (const filePath of paths) {
    const raw = files[filePath]?.content || '';

    if (typeof raw !== 'string' || raw.length === 0) {
      excerpts.push(`- ${filePath}`);
      continue;
    }

    const budget = Math.min(MAX_FOLLOWUP_FILE_CHARS, MAX_FOLLOWUP_TOTAL_CHARS - used);

    if (budget < 80) {
      excerpts.push(`- ${filePath} (${raw.length} chars, omitted)`);
      continue;
    }

    const sanitized = raw.replace(/<\/?bolt(?:Artifact|Action)\b[^>]*>/gi, '');
    const slice =
      sanitized.length > budget
        ? `${sanitized.slice(0, budget)}\n/* truncated ${sanitized.length - budget} chars */`
        : sanitized;
    used += slice.length;
    excerpts.push(`<file path="${filePath}">\n${slice}\n</file>`);
  }

  return `
<workspace_status id="${id}">
The project is already in the WebContainer. Edit only the files this follow-up asks for.
Do not scaffold from scratch. Do not open a second boltArtifact unless you need to write files.
Do not add a second start action if the preview is already live.
Changed files:
${excerpts.join('\n')}
</workspace_status>
`;
};

export function compactFileMap(
  files: Record<string, { type?: string; content?: string; isBinary?: boolean; isLocked?: boolean } | undefined>,
  options?: { maxFiles?: number; maxChars?: number },
): Record<string, { type: 'file'; content: string; isBinary: boolean; isLocked?: boolean }> {
  const maxFiles = options?.maxFiles ?? 80;
  const maxChars = options?.maxChars ?? 180000;
  const compact: Record<string, { type: 'file'; content: string; isBinary: boolean; isLocked?: boolean }> = {};
  let used = 0;
  let count = 0;

  for (const [filePath, fileObj] of Object.entries(files || {})) {
    if (!fileObj || fileObj.type !== 'file' || fileObj.isBinary || typeof fileObj.content !== 'string') {
      continue;
    }

    if (isSkippablePath(filePath)) {
      continue;
    }

    if (count >= maxFiles || used >= maxChars) {
      break;
    }

    const remaining = maxChars - used;
    const content = fileObj.content.length > remaining ? fileObj.content.slice(0, remaining) : fileObj.content;
    compact[filePath] = {
      type: 'file',
      content,
      isBinary: false,
      isLocked: fileObj.isLocked,
    };
    used += content.length;
    count += 1;
  }

  return compact;
};
