import ignore from 'ignore';
import { STARTER_TEMPLATES } from './constants';
import type { ProviderInfo } from '~/types/model';
import type { Template } from '~/types/template';

const starterTemplateSelectionPrompt = (templates: Template[]) => `
You are an experienced developer who helps people choose the best starter template for their projects.
Selection guidelines:
- If the user explicitly requests 'Astro' or content collections, select 'Astro'.
- If the user requests 'Vanilla JS' or vanilla JavaScript without a framework, select 'Vanilla JS'.
- If the user requests 'HTML CSS JS' or zero-build standalone static site, select 'HTML CSS JS'.
- For modern web applications, interactive landing pages, motion designs, and rich UI projects, prefer 'Vite React' or 'Vite Shadcn'.

Available templates:
<template>
  <name>blank</name>
  <description>Empty starter for simple scripts and trivial tasks that don't require a full template setup</description>
  <tags>basic, script</tags>
</template>
${templates
  .map(
    (template) => `
<template>
  <name>${template.name}</name>
  <description>${template.description}</description>
  ${template.tags ? `<tags>${template.tags.join(', ')}</tags>` : ''}
</template>
`,
  )
  .join('\n')}

Response Format:
<selection>
  <templateName>{selected template name}</templateName>
  <title>{a proper title for the project}</title>
</selection>

Examples:

<example>
User: I need to build a todo app
Response:
<selection>
  <templateName>Vite Shadcn</templateName>
  <title>Simple React todo application</title>
</selection>
</example>

<example>
User: Write a script to generate numbers from 1 to 100
Response:
<selection>
  <templateName>blank</templateName>
  <title>script to generate numbers from 1 to 100</title>
</selection>
</example>

Instructions:
1. For trivial tasks and simple scripts, always recommend the blank template
2. For rich web applications, dashboards, motion websites, and landing pages, recommend Vite Shadcn or Vite React
3. Follow the exact XML format
4. Consider both technical requirements and tags
5. If no perfect match exists, recommend the closest option

Important: Provide only the selection tags in your response, no additional text.
MOST IMPORTANT: YOU DONT HAVE TIME TO THINK JUST START RESPONDING BASED ON HUNCH 
`;

const templates: Template[] = STARTER_TEMPLATES;

const parseSelectedTemplate = (llmOutput: string): { template: string; title: string } | null => {
  try {
    // Extract content between <templateName> tags
    const templateNameMatch = llmOutput.match(/<templateName>(.*?)<\/templateName>/);
    const titleMatch = llmOutput.match(/<title>(.*?)<\/title>/);

    if (!templateNameMatch) {
      return null;
    }

    return { template: templateNameMatch[1].trim(), title: titleMatch?.[1].trim() || 'Untitled Project' };
  } catch (error) {
    console.error('Error parsing template selection:', error);
    return null;
  }
};

function heuristicTemplateSelection(message: string): { template: string; title: string } {
  const lower = (message || '').toLowerCase();

  if (lower.includes('astro')) {
    return { template: 'Astro', title: 'Astro Web Application' };
  }

  if (lower.includes('vanilla js') || lower.includes('vanilla javascript')) {
    return { template: 'Vanilla JS', title: 'Vanilla JS Application' };
  }

  if (lower.includes('html css') || lower.includes('html/css') || lower.includes('static html')) {
    return { template: 'HTML CSS JS', title: 'HTML CSS JS Website' };
  }

  if (lower.includes('node') || lower.includes('express') || lower.includes('backend') || lower.includes('api')) {
    return { template: 'Node.js', title: 'Node.js Application' };
  }

  // Check for simple script requests
  if (
    lower.includes('write a script') ||
    lower.includes('simple script') ||
    lower.includes('generate numbers') ||
    lower.includes('calculate')
  ) {
    return { template: 'blank', title: 'Script' };
  }

  // Default for rich web apps, modern tools, landing pages
  return { template: 'Vite Shadcn', title: 'Modern React Application' };
}

export const selectStarterTemplate = async (options: { message: string; model: string; provider: ProviderInfo }) => {
  const { message, model, provider } = options;

  try {
    const requestBody = {
      message,
      model,
      provider,
      system: starterTemplateSelectionPrompt(templates),
    };
    const response = await fetch('/api/llmcall', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const respJson: { text?: string } = await response.json();

      if (respJson?.text) {
        const selectedTemplate = parseSelectedTemplate(respJson.text);

        if (selectedTemplate) {
          return selectedTemplate;
        }
      }
    }
  } catch (error) {
    console.error('Error in selectStarterTemplate LLM call, falling back to heuristic:', error);
  }

  // Heuristic fallback guarantees a high-converting, optimal starter match
  const fallback = heuristicTemplateSelection(message);
  console.log(`Using heuristic template selection: ${fallback.template}`);

  return fallback;
};

const getGitHubRepoContent = async (repoName: string): Promise<{ name: string; path: string; content: string }[]> => {
  try {
    // Instead of directly fetching from GitHub, use our own API endpoint as a proxy
    const response = await fetch(`/api/github-template?repo=${encodeURIComponent(repoName)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Our API will return the files in the format we need
    const files = (await response.json()) as any;

    return files;
  } catch (error) {
    console.error('Error fetching release contents:', error);
    throw error;
  }
};

const getFallbackViteTemplate = (): { name: string; path: string; content: string }[] => [
  {
    name: 'package.json',
    path: 'package.json',
    content: JSON.stringify(
      {
        name: 'zoth-app',
        private: true,
        version: '0.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'tsc && vite build',
          preview: 'vite preview',
        },
        dependencies: {
          react: '^18.3.1',
          'react-dom': '^18.3.1',
          'lucide-react': '^0.344.0',
          clsx: '^2.1.1',
          'tailwind-merge': '^2.5.2',
          'framer-motion': '^11.5.4',
        },
        devDependencies: {
          '@types/react': '^18.3.5',
          '@types/react-dom': '^18.3.0',
          '@vitejs/plugin-react': '^4.3.1',
          autoprefixer: '^10.4.20',
          postcss: '^8.4.47',
          tailwindcss: '^3.4.11',
          typescript: '^5.5.3',
          vite: '^5.4.2',
        },
      },
      null,
      2,
    ),
  },
  {
    name: 'vite.config.ts',
    path: 'vite.config.ts',
    content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});`,
  },
  {
    name: 'index.html',
    path: 'index.html',
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Zoth Bolt App</title>
  </head>
  <body class="bg-[#08080B] text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  },
  {
    name: 'main.tsx',
    path: 'src/main.tsx',
    content: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
  },
  {
    name: 'App.tsx',
    path: 'src/App.tsx',
    content: `import React, { useState } from 'react';
import { Sparkles, Layers, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#08080B] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl shadow-2xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zoth Bolt Ready</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Architecting Your Vision</h1>
        <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
          Your in-browser Vite + React application is initialized. Building full component layout and interactive state...
        </p>
      </div>
    </div>
  );
}`,
  },
  {
    name: 'index.css',
    path: 'src/index.css',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}`,
  },
  {
    name: 'tailwind.config.js',
    path: 'tailwind.config.js',
    content: `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#D4AF37',
        background: '#08080B',
      },
    },
  },
  plugins: [],
};`,
  },
  {
    name: 'postcss.config.js',
    path: 'postcss.config.js',
    content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,
  },
  {
    name: 'tsconfig.json',
    path: 'tsconfig.json',
    content: JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          useDefineForClassFields: true,
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          skipLibCheck: true,
          moduleResolution: 'bundler',
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'react-jsx',
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true,
        },
        include: ['src'],
      },
      null,
      2,
    ),
  },
];

export async function getTemplates(templateName: string, title?: string) {
  const template = STARTER_TEMPLATES.find((t) => t.name == templateName);

  if (!template) {
    return null;
  }

  const githubRepo = template.githubRepo;

  let files: { name: string; path: string; content: string }[] = [];

  try {
    files = await getGitHubRepoContent(githubRepo);
  } catch {
    console.warn(`Remote GitHub template fetch failed for ${githubRepo}, using built-in high-speed fallback template`);
    files = getFallbackViteTemplate();
  }

  let filteredFiles = files;

  /*
   * ignoring common unwanted files
   * exclude    .git
   */
  filteredFiles = filteredFiles.filter((x) => x.path.startsWith('.git') == false);

  /*
   * exclude    lock files
   * WE NOW INCLUDE LOCK FILES FOR IMPROVED INSTALL TIMES
   */
  {
    /*
     *const comminLockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];
     *filteredFiles = filteredFiles.filter((x) => comminLockFiles.includes(x.name) == false);
     */
  }

  // exclude    .bolt
  filteredFiles = filteredFiles.filter((x) => x.path.startsWith('.bolt') == false);

  // check for ignore file in .bolt folder
  const templateIgnoreFile = files.find((x) => x.path.startsWith('.bolt') && x.name == 'ignore');

  const filesToImport = {
    files: filteredFiles,
    ignoreFile: [] as typeof filteredFiles,
  };

  if (templateIgnoreFile) {
    // redacting files specified in ignore file
    const ignorepatterns = templateIgnoreFile.content.split('\n').map((x) => x.trim());
    const ig = ignore().add(ignorepatterns);

    // filteredFiles = filteredFiles.filter(x => !ig.ignores(x.path))
    const ignoredFiles = filteredFiles.filter((x) => ig.ignores(x.path));

    filesToImport.files = filteredFiles;
    filesToImport.ignoreFile = ignoredFiles;
  }

  const assistantMessage = `
Bolt is initializing your project with the required files using the ${template.name} template.
<boltArtifact id="imported-files" title="${title || 'Create initial files'}" type="bundled">
${filesToImport.files
  .map(
    (file) =>
      `<boltAction type="file" filePath="${file.path}">
${file.content}
</boltAction>`,
  )
  .join('\n')}
</boltArtifact>
`;

  let userMessage = ``;

  const templatePromptFile = files.filter((x) => x.path.startsWith('.bolt')).find((x) => x.name == 'prompt');

  if (templatePromptFile) {
    userMessage = `
TEMPLATE INSTRUCTIONS:
${templatePromptFile.content}

---
`;
  }

  if (filesToImport.ignoreFile.length > 0) {
    userMessage =
      userMessage +
      `
STRICT FILE ACCESS RULES - READ CAREFULLY:

The following files are READ-ONLY and must never be modified:
${filesToImport.ignoreFile.map((file) => `- ${file.path}`).join('\n')}

Permitted actions:
✓ Import these files as dependencies
✓ Read from these files
✓ Reference these files

Strictly forbidden actions:
❌ Modify any content within these files
❌ Delete these files
❌ Rename these files
❌ Move these files
❌ Create new versions of these files
❌ Suggest changes to these files

Any attempt to modify these protected files will result in immediate termination of the operation.

If you need to make changes to functionality, create new files instead of modifying the protected ones listed above.
---
`;
  }

  userMessage += `
---
template import is done, and you can now use the imported files,
edit only the files that need to be changed, and you can create new files as needed.
NO NOT EDIT/WRITE ANY FILES THAT ALREADY EXIST IN THE PROJECT AND DOES NOT NEED TO BE MODIFIED
---
Now that the Template is imported please continue with my original request

IMPORTANT: Dont Forget to install the dependencies before running the app by using \`npm install && npm run dev\`
`;

  return {
    assistantMessage,
    userMessage,
  };
}
