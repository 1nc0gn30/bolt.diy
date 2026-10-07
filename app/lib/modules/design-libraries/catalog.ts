/**
 * Zoth 2026 Design, Framework & Animation Library Catalog
 * Comprehensive database of 280+ modern frameworks, UI systems, motion engines,
 * typography pairings, and visual FX commodities for autonomous application synthesis.
 *
 * Creator: Neal Frazier Tech (@1nc0gn30) • NullAI Platform
 */

export interface CatalogItem {
  id: string;
  name: string;
  category: 'framework' | 'ui-library' | 'animation' | 'commodity' | 'typography' | 'palette';
  description: string;
  tags: string[];
  npmPackage?: string;
  cdnUrl?: string;
  icon?: string;
  badge?: string;
  bestFor?: string;
  samplePromptSnippet?: string;
}

/*
 * ==========================================================================
 * 1. Framework Options (Astro, Vite React, Vanilla JS, HTML/CSS/JS, etc.)
 * ==========================================================================
 */
export const FRAMEWORK_OPTIONS: CatalogItem[] = [
  {
    id: 'astro',
    name: 'Astro (Latest 5+)',
    category: 'framework',
    description:
      'Next-generation web framework for content-driven and modern interactive sites with zero-JS by default, islands architecture, and fast SSG/SSR.',
    tags: ['astro', 'islands', 'ssr', 'ssg', 'content', 'tailwind', 'fast'],
    npmPackage: 'astro',
    badge: 'Latest 5+',
    bestFor: 'Content sites, editorial blogs, high-performance portfolios, and hybrid apps',
    samplePromptSnippet:
      'Scaffold using the latest Astro 5 framework with islands architecture, .astro components, and Tailwind CSS.',
  },
  {
    id: 'astro-starlight',
    name: 'Astro + Starlight (Docs & Knowledge Base)',
    category: 'framework',
    description:
      'Official Astro documentation theme with built-in search, internationalization, dark mode, and Markdown/MDX support.',
    tags: ['astro', 'starlight', 'docs', 'markdown', 'mdx', 'knowledge-base'],
    npmPackage: '@astrojs/starlight',
    badge: 'Docs Standard',
    bestFor: 'Developer documentation, API references, knowledge bases, and user guides',
    samplePromptSnippet:
      'Build an Astro Starlight documentation site with search, dark mode, and interactive MDX components.',
  },
  {
    id: 'vite-react',
    name: 'Vite + React 19',
    category: 'framework',
    description:
      'Blazing fast modern SPA architecture powered by Vite, React 19, TypeScript, and Tailwind CSS with sub-millisecond HMR in WebContainer.',
    tags: ['react', 'vite', 'typescript', 'tailwind', 'spa', 'react-19'],
    npmPackage: 'vite',
    badge: 'React 19',
    bestFor: 'Complex SaaS dashboards, interactive web apps, stateful client tools, and games',
    samplePromptSnippet: 'Build as a Vite + React 19 single-page application with TypeScript and Tailwind CSS.',
  },
  {
    id: 'vite-vue',
    name: 'Vite + Vue 3',
    category: 'framework',
    description:
      'Modern reactive frontend utilizing Vue 3 Composition API, script setup, Pinia state management, and Vite speed.',
    tags: ['vue', 'vue3', 'vite', 'pinia', 'reactive', 'composition-api'],
    npmPackage: 'vite vue',
    badge: 'Vue 3',
    bestFor: 'Reactive web dashboards, consumer tools, and data-driven portals',
    samplePromptSnippet: 'Build as a Vite + Vue 3 SPA with Composition API and Tailwind CSS.',
  },
  {
    id: 'vite-svelte',
    name: 'Vite + Svelte 5',
    category: 'framework',
    description:
      'Ultra-lightweight reactive client application powered by Svelte 5 Runes ($state, $derived) and zero virtual DOM overhead.',
    tags: ['svelte', 'svelte5', 'runes', 'vite', 'ultra-light'],
    npmPackage: 'vite svelte',
    badge: 'Svelte 5 Runes',
    bestFor: 'High-speed client widgets, lightweight tools, and interactive micro-apps',
    samplePromptSnippet: 'Build using Svelte 5 with modern Runes reactivity and Tailwind CSS.',
  },
  {
    id: 'vanilla-js',
    name: 'Vanilla JS (Vite)',
    category: 'framework',
    description:
      'Pure, unadulterated ES6+ Vanilla JavaScript with modern Vite bundling. Zero framework abstractions, maximum performance, and raw DOM control.',
    tags: ['vanilla', 'javascript', 'vite', 'esm', 'lightweight', 'zero-framework'],
    npmPackage: 'vite',
    badge: 'Pure JS',
    bestFor: 'High-performance interactive widgets, canvas games, utility tools, and micro-apps',
    samplePromptSnippet: 'Build in pure Vanilla JavaScript (ES Modules) using Vite with modular DOM manipulation.',
  },
  {
    id: 'vanilla-esm',
    name: 'Vanilla JS (Pure ESM Modules)',
    category: 'framework',
    description: 'Direct browser ES Modules without any bundler or build step. Modern native browser standard.',
    tags: ['vanilla', 'esm', 'native', 'no-bundler', 'pure'],
    badge: 'Native ESM',
    bestFor: 'Simple scripts, browser-native experiments, and embeddable modules',
    samplePromptSnippet:
      'Create with native browser ES modules (<script type="module">) with zero bundler dependencies.',
  },
  {
    id: 'html-css-js',
    name: 'HTML5 + CSS3 + JS (Zero-Build)',
    category: 'framework',
    description:
      'Standalone, zero-build static web application (index.html, style.css, script.js). Runs anywhere without node_modules or compile steps.',
    tags: ['html5', 'css3', 'static', 'no-build', 'zero-dependencies', 'portable'],
    badge: 'Zero-Build',
    bestFor: 'Portable landing pages, lightweight single-file tools, and embeds',
    samplePromptSnippet:
      'Create as a clean, portable HTML5 + CSS3 + vanilla JavaScript project with zero build dependencies.',
  },
  {
    id: 'nextjs-shadcn',
    name: 'Next.js App Router',
    category: 'framework',
    description:
      'Production React framework with App Router, server components, and pre-configured shadcn/ui component architecture.',
    tags: ['nextjs', 'react', 'shadcn', 'tailwind', 'fullstack'],
    npmPackage: 'next',
    badge: 'Fullstack',
    bestFor: 'Production fullstack enterprise platforms with server actions',
    samplePromptSnippet: 'Build using Next.js App Router structure with shadcn/ui and Tailwind CSS.',
  },
  {
    id: 'nextjs-pages',
    name: 'Next.js Pages Router',
    category: 'framework',
    description:
      'Classic Next.js file-system routing with getStaticProps and getServerSideProps for reliable static generation.',
    tags: ['nextjs', 'pages-router', 'ssg', 'ssr'],
    npmPackage: 'next',
    badge: 'Classic Next',
    bestFor: 'Enterprise legacy migrations and rock-solid static exports',
    samplePromptSnippet: 'Build using Next.js Pages router with static generation and Tailwind CSS.',
  },
  {
    id: 'remix-router-v7',
    name: 'React Router v7 / Remix',
    category: 'framework',
    description:
      'Unified React Router v7 with Vite plugin, progressive enhancement, loaders, actions, and nested layouts.',
    tags: ['remix', 'react-router', 'v7', 'loaders', 'fullstack'],
    npmPackage: '@react-router/dev',
    badge: 'React Router 7',
    bestFor: 'Data-intensive web applications with nested master-detail routes',
    samplePromptSnippet: 'Build using React Router v7 with nested routes, loaders, and actions.',
  },
  {
    id: 'sveltekit',
    name: 'SvelteKit Fullstack',
    category: 'framework',
    description:
      'Ultra-lean compiled reactive framework with Svelte 5 Runes for minimal bundle footprints and silky-smooth animations.',
    tags: ['svelte', 'sveltekit', 'runes', 'reactive', 'performance'],
    npmPackage: '@sveltejs/kit',
    badge: 'Svelte 5',
    bestFor: 'Ultra-lightweight high-speed client apps and reactive data tools',
    samplePromptSnippet: 'Build using SvelteKit with Svelte 5 Runes for fine-grained reactivity.',
  },
  {
    id: 'nuxt3',
    name: 'Nuxt 3 (Vue 3 SSR/SSG)',
    category: 'framework',
    description:
      'Intuitive fullstack Vue 3 framework with auto-imports, file-based routing, and built-in Nitro server.',
    tags: ['nuxt', 'vue3', 'nitro', 'ssr', 'ssg'],
    npmPackage: 'nuxt',
    badge: 'Nuxt 3',
    bestFor: 'Vue-centric web applications and SEO-optimized web portals',
    samplePromptSnippet: 'Build using Nuxt 3 with Vue 3 Composition API and Tailwind CSS.',
  },
  {
    id: 'qwik',
    name: 'Qwik Resumable',
    category: 'framework',
    description:
      'Instant-on resumable web framework that serializes application state into HTML with 0ms hydration overhead.',
    tags: ['qwik', 'resumable', 'performance', 'zero-hydration'],
    npmPackage: '@builder.io/qwik',
    badge: 'Resumable',
    bestFor: 'High-traffic consumer sites and e-commerce requiring instant TTIs',
    samplePromptSnippet: 'Build as a Qwik application using resumable components and fine-grained lazy loading.',
  },
  {
    id: 'solidjs',
    name: 'SolidJS SPA',
    category: 'framework',
    description:
      'Declarative, efficient and flexible JavaScript library with true reactive primitives and zero virtual DOM overhead.',
    tags: ['solidjs', 'reactive', 'signals', 'no-vdom'],
    npmPackage: 'solid-js',
    badge: 'Fine-Grained',
    bestFor: 'Real-time charts, audio visualizers, and high-frequency reactive dashboards',
    samplePromptSnippet: 'Build using SolidJS with reactive signals and Tailwind CSS.',
  },
  {
    id: 'tanstack-start',
    name: 'TanStack Start',
    category: 'framework',
    description:
      'Full-stack React framework powered by TanStack Router, Vinxi, and full type safety from server to client.',
    tags: ['tanstack', 'router', 'type-safe', 'vinxi', 'fullstack'],
    npmPackage: '@tanstack/react-start',
    badge: '100% Type-Safe',
    bestFor: 'Modern TypeScript-heavy web applications needing bulletproof routing',
    samplePromptSnippet: 'Build using TanStack Start with full end-to-end type safety.',
  },
  {
    id: 'hono-jsx',
    name: 'Hono + Client JSX',
    category: 'framework',
    description: 'Ultra-fast, ultra-lightweight web standards framework (under 15kB) with native JSX support.',
    tags: ['hono', 'jsx', 'lightweight', 'edge', 'standards'],
    npmPackage: 'hono',
    badge: '< 15kB Edge',
    bestFor: 'Micro-APIs, fast static sites, and edge utility applications',
    samplePromptSnippet: 'Build using Hono with JSX rendering for minimal bundle weight.',
  },
  {
    id: 'alpine-tailwind',
    name: 'Alpine.js + Tailwind CSS',
    category: 'framework',
    description:
      'Rugged, minimal tool for composing behavior directly in markup. The modern jQuery replacement paired with Tailwind.',
    tags: ['alpinejs', 'tailwind', 'html-first', 'lightweight', 'no-build'],
    npmPackage: 'alpinejs',
    badge: 'HTML-First',
    bestFor: 'Interactive landing pages, simple dropdowns/modals, and lightweight apps',
    samplePromptSnippet: 'Build using Alpine.js for lightweight reactive directives and Tailwind CSS.',
  },
  {
    id: 'lit-components',
    name: 'Lit 3 (Web Components)',
    category: 'framework',
    description:
      'Google simple library for building fast, lightweight Web Components that work in any framework or raw HTML.',
    tags: ['lit', 'web-components', 'custom-elements', 'standards'],
    npmPackage: 'lit',
    badge: 'Web Standard',
    bestFor: 'Design system components, embeddable widgets, and framework-agnostic UI',
    samplePromptSnippet: 'Build using Lit 3 Web Components with reactive properties and scoped styles.',
  },
  {
    id: 'preact-signals',
    name: 'Preact + Signals',
    category: 'framework',
    description:
      'Fast 3kB alternative to React with modern fine-grained reactive Signals and identical virtual DOM API.',
    tags: ['preact', 'signals', '3kb', 'react-compatible'],
    npmPackage: 'preact @preact/signals',
    badge: '3kB React',
    bestFor: 'Performance-critical client apps and embedded micro-frontends',
    samplePromptSnippet: 'Build using Preact and Preact Signals for ultra-compact bundle size.',
  },
];

/*
 * ==========================================================================
 * 2. UI Design Libraries & Component Systems (70+ items)
 * ==========================================================================
 */
export const UI_LIBRARIES: CatalogItem[] = [
  {
    id: 'shadcn-ui',
    name: 'shadcn/ui (New York)',
    category: 'ui-library',
    description:
      'Beautifully designed, accessible components built with Radix UI and Tailwind CSS that you copy and paste into your apps.',
    tags: ['radix', 'tailwind', 'accessible', 'clean', 'standard'],
    npmPackage: 'clsx tailwind-merge @radix-ui/react-slot',
    badge: 'Industry Standard',
  },
  {
    id: 'aceternity-ui',
    name: 'Aceternity UI',
    category: 'ui-library',
    description:
      'Trending avant-garde components with animated border beams, lamp effects, 3D pin cards, and spotlight containers.',
    tags: ['framer-motion', 'tailwind', 'futuristic', 'dark-mode'],
    npmPackage: 'framer-motion clsx tailwind-merge',
    badge: 'Trending Avant-Garde',
  },
  {
    id: 'magic-ui',
    name: 'Magic UI',
    category: 'ui-library',
    description:
      '50+ animated components for landing pages featuring marquee, retro grid, aurora backgrounds, and particle beams.',
    tags: ['motion', 'landing-page', 'particles', 'modern'],
    npmPackage: 'framer-motion',
    badge: 'Motion Heavy',
  },
  {
    id: 'cult-ui',
    name: 'Cult UI',
    category: 'ui-library',
    description:
      'Radical and bespoke micro-interactions, spring buttons, dynamic dock bars, and experimental UI primitives.',
    tags: ['experimental', 'micro-interactions', 'avant-garde', 'cult'],
    badge: 'Avant-Garde Micro',
  },
  {
    id: 'tailwind-v4',
    name: 'Tailwind CSS v4',
    category: 'ui-library',
    description:
      'The next generation of Tailwind with pure CSS configuration (@theme), native cascading layers, and 10x faster compilation.',
    tags: ['tailwind', 'css-first', 'modern', 'zero-config'],
    npmPackage: 'tailwindcss@next @tailwindcss/vite@next',
    badge: 'Next-Gen CSS',
  },
  {
    id: 'radix-themes',
    name: 'Radix Themes',
    category: 'ui-library',
    description:
      'Production-ready component library for fast development of high-quality, accessible interfaces with dark theme support.',
    tags: ['radix', 'accessible', 'design-system', 'dark-mode'],
    npmPackage: '@radix-ui/themes',
    badge: 'Accessible',
  },
  {
    id: 'nextui',
    name: 'NextUI / HeroUI',
    category: 'ui-library',
    description:
      'Beautiful, fast and modern React UI library with custom themes, smooth spring transitions, and rich color scales.',
    tags: ['react', 'tailwind', 'modern', 'springs'],
    npmPackage: '@nextui-org/react',
    badge: 'Rich Themes',
  },
  {
    id: 'daisyui',
    name: 'DaisyUI v5',
    category: 'ui-library',
    description:
      'The most popular component library for Tailwind CSS with 30+ semantic color themes and pure semantic CSS class names.',
    tags: ['tailwind', 'pure-css', 'themes', 'semantic'],
    npmPackage: 'daisyui',
    badge: '30+ Themes',
  },
  {
    id: 'flowbite',
    name: 'Flowbite React',
    category: 'ui-library',
    description:
      'Open-source component library built on top of Tailwind CSS with Figma design system tokens and responsive widgets.',
    tags: ['flowbite', 'tailwind', 'figma', 'responsive'],
    npmPackage: 'flowbite-react',
  },
  {
    id: 'chakra-ui',
    name: 'Chakra UI v3',
    category: 'ui-library',
    description:
      'Simple, modular and accessible component library that gives you the building blocks to build modern React applications.',
    tags: ['accessible', 'component-driven', 'modular'],
    npmPackage: '@chakra-ui/react',
  },
  {
    id: 'mantine',
    name: 'Mantine v7',
    category: 'ui-library',
    description:
      'Feature-rich React components library with 100+ customizable components, notification system, and form hooks.',
    tags: ['hooks', 'forms', 'rich', 'enterprise'],
    npmPackage: '@mantine/core @mantine/hooks',
  },
  {
    id: 'mui-material',
    name: 'Material UI (MUI v6)',
    category: 'ui-library',
    description: 'Comprehensive suite of UI tools implementing Google Material Design 3 with theme customization.',
    tags: ['material', 'google', 'enterprise', 'established'],
    npmPackage: '@mui/material @emotion/react @emotion/styled',
  },
  {
    id: 'base-ui',
    name: 'Base UI (MUI Headless)',
    category: 'ui-library',
    description:
      'Unstyled React component library from the MUI team for building design systems with complete styling freedom.',
    tags: ['unstyled', 'accessible', 'mui', 'headless'],
    npmPackage: '@base-ui-components/react',
    badge: 'MUI Headless',
  },
  {
    id: 'ant-design',
    name: 'Ant Design 5',
    category: 'ui-library',
    description:
      'An enterprise-class UI design language and React UI library with deep internationalization and enterprise table widgets.',
    tags: ['enterprise', 'data-dense', 'tables', 'admin'],
    npmPackage: 'antd',
  },
  {
    id: 'headless-ui',
    name: 'Headless UI',
    category: 'ui-library',
    description:
      'Completely unstyled, fully accessible UI components designed to integrate beautifully with Tailwind CSS.',
    tags: ['unstyled', 'accessible', 'tailwind-labs'],
    npmPackage: '@headlessui/react',
  },
  {
    id: 'react-aria',
    name: 'React Aria Components',
    category: 'ui-library',
    description:
      'Adobe library of unstyled, accessible UI components with full keyboard navigation and screen-reader support.',
    tags: ['adobe', 'accessibility', 'unstyled', 'w3c'],
    npmPackage: 'react-aria-components',
  },
  {
    id: 'ark-ui',
    name: 'Ark UI (Chakra Team)',
    category: 'ui-library',
    description:
      'Universal, headless component library powered by Zag.js state machines. Multi-framework, accessible, and fast.',
    tags: ['zag', 'state-machines', 'headless', 'multi-framework'],
    npmPackage: '@ark-ui/react',
  },
  {
    id: 'park-ui',
    name: 'Park UI',
    category: 'ui-library',
    description:
      'Beautifully designed components built with Ark UI and Panda CSS with multi-framework and multi-token support.',
    tags: ['panda-css', 'ark-ui', 'modern', 'themeable'],
  },
  {
    id: 'tremor',
    name: 'Tremor UI',
    category: 'ui-library',
    description:
      'The React library to build dashboards fast. Rich charts, analytics widgets, sparklines, and metric cards.',
    tags: ['dashboards', 'analytics', 'charts', 'fintech'],
    npmPackage: '@tremor/react',
    badge: 'Fintech Dashboards',
  },
  {
    id: 'primereact',
    name: 'PrimeReact',
    category: 'ui-library',
    description:
      'Comprehensive UI component suite with 80+ components including advanced DataTables, TreeTables, and Charts.',
    tags: ['datatable', 'rich-components', 'enterprise'],
    npmPackage: 'primereact primeicons',
  },
  {
    id: 'shadcn-vue',
    name: 'shadcn-vue',
    category: 'ui-library',
    description:
      'Vue 3 port of shadcn/ui built on Radix Vue and Tailwind CSS for seamless copy-paste component architecture.',
    tags: ['vue3', 'shadcn', 'radix-vue', 'tailwind'],
    npmPackage: 'radix-vue clsx tailwind-merge',
  },
  {
    id: 'bits-ui',
    name: 'Bits UI (Svelte)',
    category: 'ui-library',
    description:
      'The headless component primitives for Svelte. Accessible, unstyled, and customizable building blocks.',
    tags: ['svelte', 'headless', 'accessible', 'unstyled'],
    npmPackage: 'bits-ui',
  },
  {
    id: 'corvu',
    name: 'Corvu (SolidJS)',
    category: 'ui-library',
    description: 'A collection of unstyled, accessible, and customizable UI primitives for SolidJS.',
    tags: ['solidjs', 'primitives', 'unstyled', 'accessible'],
    npmPackage: '@corvu/primitives',
  },
  {
    id: 'keep-react',
    name: 'Keep React',
    category: 'ui-library',
    description:
      'Modern, minimalist open-source React component library based on Tailwind CSS and clean Figma guidelines.',
    tags: ['tailwind', 'clean', 'minimalist', 'figma'],
    npmPackage: 'keep-react',
  },
  {
    id: 'preline-ui',
    name: 'Preline UI',
    category: 'ui-library',
    description:
      'Open-source Tailwind CSS components library for any needs. Fully responsive with comprehensive UI blocks.',
    tags: ['tailwind', 'enterprise', 'responsive', 'ui-blocks'],
    npmPackage: 'preline',
  },
  {
    id: 'flyonui',
    name: 'FlyonUI',
    category: 'ui-library',
    description: 'Next-gen semantic Tailwind CSS component library with rich interactivity and zero JavaScript bloat.',
    tags: ['semantic', 'tailwind', 'interactive', 'accessible'],
  },
  {
    id: 'ripple-ui',
    name: 'Ripple UI',
    category: 'ui-library',
    description:
      'A complete and modern Tailwind CSS component library with custom color palettes and responsive layouts.',
    tags: ['tailwind', 'modern', 'lightweight'],
  },
  {
    id: 'mamba-ui',
    name: 'Mamba UI',
    category: 'ui-library',
    description:
      'Free, open-source collection of beautiful Tailwind CSS UI components and templates for landing pages.',
    tags: ['tailwind', 'templates', 'landing-page'],
  },
  {
    id: 'pines-ui',
    name: 'Pines UI',
    category: 'ui-library',
    description: 'A library of Alpine and Tailwind UI components and elements for modern interactive websites.',
    tags: ['alpinejs', 'tailwind', 'micro-components'],
  },
  {
    id: 'float-ui',
    name: 'Float UI',
    category: 'ui-library',
    description: 'Modern UI components and website templates built with Tailwind CSS, React, and Vue.',
    tags: ['tailwind', 'templates', 'marketing'],
  },
  {
    id: 'horizon-ui',
    name: 'Horizon UI',
    category: 'ui-library',
    description:
      'Trendiest Open Source Admin Dashboard Template for Tailwind CSS & React with 70+ dark/light components.',
    tags: ['dashboard', 'admin', 'tailwind', 'dark-mode'],
  },
  {
    id: 'tailblocks',
    name: 'Tailblocks',
    category: 'ui-library',
    description:
      'Ready-to-use Tailwind CSS blocks for fast landing page assembly: heroes, features, pricing, testimonials, and footers.',
    tags: ['tailwind', 'blocks', 'landing-pages', 'fast'],
  },
  {
    id: 'meraki-ui',
    name: 'Meraki UI',
    category: 'ui-library',
    description: '60+ responsive Tailwind CSS components with RTL support and modern dark mode styling.',
    tags: ['tailwind', 'rtl', 'dark-mode', 'responsive'],
  },
  {
    id: 'sailboat-ui',
    name: 'Sailboat UI',
    category: 'ui-library',
    description: 'A modern UI component tool for Tailwind CSS with 150+ ready-to-use components.',
    tags: ['tailwind', 'components', 'responsive'],
  },
  {
    id: 'hyperui',
    name: 'HyperUI',
    category: 'ui-library',
    description: 'Free open source Tailwind CSS components for marketing, eCommerce, and application dashboards.',
    tags: ['tailwind', 'ecommerce', 'marketing', 'dashboard'],
  },
  {
    id: 'uiverse-io',
    name: 'UIverse Community Primitives',
    category: 'ui-library',
    description:
      'World largest open-source library of 3,000+ pure CSS buttons, checkboxes, loaders, cards, and inputs.',
    tags: ['css-only', 'community', 'micro-elements', 'creative'],
    badge: '3,000+ CSS Snippets',
  },
  {
    id: 'panda-css',
    name: 'Panda CSS',
    category: 'ui-library',
    description:
      'Universal, type-safe, zero-runtime CSS-in-JS engine with modern recipes, conditions, and JSX patterns.',
    tags: ['css-in-js', 'zero-runtime', 'type-safe', 'recipes'],
    npmPackage: '@pandacss/dev',
  },
  {
    id: 'kuma-ui',
    name: 'Kuma UI',
    category: 'ui-library',
    description: 'Zero-runtime CSS-in-JS with headless components and hybrid styling performance.',
    tags: ['zero-runtime', 'css-in-js', 'hybrid'],
    npmPackage: '@kuma-ui/core',
  },
  {
    id: 'open-props',
    name: 'Open Props',
    category: 'ui-library',
    description:
      'Super-charged CSS custom properties for modern layout, animations, fluid typography, and dark-mode elevation.',
    tags: ['css-variables', 'zero-js', 'fluid', 'elevation'],
    npmPackage: 'open-props',
  },
  {
    id: 'pico-css',
    name: 'Pico CSS v2',
    category: 'ui-library',
    description:
      'Minimalist and semantic CSS framework for pure HTML. Zero class bloat with automatic dark mode switching.',
    tags: ['classless', 'semantic', 'minimalist', 'lightweight'],
    npmPackage: '@picocss/pico',
    badge: 'Classless / Semantic',
  },
  {
    id: 'bulma',
    name: 'Bulma CSS v1',
    category: 'ui-library',
    description: 'Modern, flexbox-based CSS framework with zero JavaScript dependencies and clean syntax.',
    tags: ['flexbox', 'css-only', 'traditional', 'clean'],
    npmPackage: 'bulma',
  },
  {
    id: 'nes-css',
    name: 'NES.css',
    category: 'ui-library',
    description:
      'NES-style (8-bit) pixel-art CSS framework for retro gaming apps, crypto web3 games, and nostalgia interfaces.',
    tags: ['retro', 'pixel-art', '8-bit', 'gaming'],
    npmPackage: 'nes.css',
    badge: 'Retro 8-Bit',
  },
  {
    id: 'paper-css',
    name: 'PaperCSS',
    category: 'ui-library',
    description:
      'The less formal CSS framework. Hand-drawn, whimsical sketch styling for indie apps and creative portfolios.',
    tags: ['hand-drawn', 'sketch', 'whimsical', 'indie'],
    npmPackage: 'papercss',
  },
  {
    id: 'water-css',
    name: 'Water.css',
    category: 'ui-library',
    description:
      'Just-add-CSS classless stylesheet that makes unstyled HTML semantic documents look readable and modern.',
    tags: ['classless', 'html-only', 'readable'],
  },
  {
    id: 'simple-css',
    name: 'Simple.css',
    category: 'ui-library',
    description:
      'Semantic CSS stylesheet designed to style clean HTML documents without cluttering markup with classes.',
    tags: ['semantic', 'clean', 'documentation'],
  },
  {
    id: 'sakura-css',
    name: 'Sakura CSS',
    category: 'ui-library',
    description: 'Minimal classless CSS theme inspired by typography standards for quick readable web documents.',
    tags: ['classless', 'minimal', 'typography'],
  },
  {
    id: 'marx-css',
    name: 'Marx CSS',
    category: 'ui-library',
    description:
      'The stylish classless CSS reset stylesheet. Clean typography and responsive grid without a single class.',
    tags: ['classless', 'reset', 'clean'],
  },
  {
    id: 'milligram',
    name: 'Milligram (2kB CSS)',
    category: 'ui-library',
    description:
      'Minimalist CSS framework providing a minimal setup of styles for a fast and clean starting point in 2kB.',
    tags: ['2kb', 'minimalist', 'micro'],
    npmPackage: 'milligram',
  },
  {
    id: 'chota',
    name: 'Chota CSS (3kB)',
    category: 'ui-library',
    description: 'A super-tiny 3kB CSS framework with grid, icons, buttons, cards, and automatic dark mode support.',
    tags: ['3kb', 'micro', 'dark-mode'],
  },
  {
    id: 'pure-css',
    name: 'Pure.css (Yahoo)',
    category: 'ui-library',
    description: 'A set of small, responsive CSS modules that you can use in every web project (under 3.8KB minified).',
    tags: ['modular', 'responsive', 'classic'],
    npmPackage: 'purecss',
  },
  {
    id: 'skeleton-ui',
    name: 'Skeleton UI',
    category: 'ui-library',
    description:
      'Powerful UI component library tailored for Svelte and Tailwind CSS with theme generators and dark mode.',
    tags: ['svelte', 'tailwind', 'themeable'],
  },
  {
    id: '98-css',
    name: '98.css',
    category: 'ui-library',
    description: 'Windows 98 design system CSS framework for nostalgic retro desktop interfaces and creative tools.',
    tags: ['retro', 'windows-98', 'nostalgia', 'authentic'],
    badge: 'Retro Win98',
  },
  {
    id: 'xp-css',
    name: 'XP.css',
    category: 'ui-library',
    description: 'Windows XP style CSS stylesheet for Luna blue nostalgic retro interfaces, dialogs, and taskbars.',
    tags: ['retro', 'windows-xp', 'nostalgia'],
  },
  {
    id: 'shoelace',
    name: 'Shoelace / Web Awesome',
    category: 'ui-library',
    description: 'A forward-thinking library of professionally designed Web Components with dark mode and animations.',
    tags: ['web-components', 'accessible', 'framework-agnostic'],
    npmPackage: '@shoelace-style/shoelace',
  },
  {
    id: 'lucide-icons',
    name: 'Lucide React Icons',
    category: 'ui-library',
    description:
      'Clean, consistent open-source icon suite with 1,000+ vector icons. The modern successor to Feather Icons.',
    tags: ['icons', 'svg', 'lucide', 'react', 'standard'],
    npmPackage: 'lucide-react',
    badge: 'Icon Standard',
  },
  {
    id: 'phosphor-icons',
    name: 'Phosphor Icons',
    category: 'ui-library',
    description:
      'Flexible icon family for interfaces, diagrams, and presentations with 6 distinct weights (regular, bold, fill, thin).',
    tags: ['icons', 'weights', 'flexible', 'vector'],
    npmPackage: '@phosphor-icons/react',
  },
  {
    id: 'tabler-icons',
    name: 'Tabler Icons (5,000+)',
    category: 'ui-library',
    description: 'Over 5,000 pixel-perfect vector icons designed on a 24x24 grid with customizable stroke width.',
    tags: ['icons', 'massive', 'custom-stroke'],
    npmPackage: '@tabler/icons-react',
  },
  {
    id: 'simple-icons',
    name: 'Simple Icons (Brands)',
    category: 'ui-library',
    description: '3,000+ SVG icons for popular world tech brands, social platforms, and developer tooling.',
    tags: ['brands', 'social', 'logos'],
    npmPackage: 'simple-icons',
  },
  {
    id: 'radix-icons',
    name: 'Radix Icons',
    category: 'ui-library',
    description: 'A crisp set of 15x15 icons designed by the WorkOS and Radix team for high-density interfaces.',
    tags: ['icons', '15x15', 'crisp', 'radix'],
    npmPackage: '@radix-ui/react-icons',
  },
  {
    id: 'feather-icons',
    name: 'Feather Icons',
    category: 'ui-library',
    description:
      'Simply beautiful open-source icons. Each icon is designed on a 24x24 grid with an emphasis on simplicity.',
    tags: ['icons', 'classic', 'minimal'],
  },
  {
    id: 'remix-icon',
    name: 'Remix Icon',
    category: 'ui-library',
    description:
      'Open-source neutral-style system symbols elaborately crafted for designers and developers with 2,800+ icons.',
    tags: ['icons', 'neutral', 'symbols'],
    npmPackage: 'remixicon',
  },
  {
    id: 'tailwind-typography',
    name: 'Tailwind Typography (@tailwindcss/typography)',
    category: 'ui-library',
    description: 'Official Tailwind plugin providing beautiful typographic defaults for Markdown and editorial prose.',
    tags: ['prose', 'markdown', 'editorial', 'typography'],
    npmPackage: '@tailwindcss/typography',
  },
  {
    id: 'tailwind-forms',
    name: 'Tailwind Forms Plugin',
    category: 'ui-library',
    description:
      'Official Tailwind plugin providing a basic reset for form styles that makes form elements easy to customize.',
    tags: ['forms', 'reset', 'tailwind'],
    npmPackage: '@tailwindcss/forms',
  },
  {
    id: 'tailwind-aspect-ratio',
    name: 'Tailwind Aspect Ratio',
    category: 'ui-library',
    description: 'Provides composable aspect-ratio utilities for videos, banners, cards, and image galleries.',
    tags: ['aspect-ratio', 'utilities', 'media'],
  },
  {
    id: 'tailwind-container-queries',
    name: 'Tailwind Container Queries (@tailwindcss/container-queries)',
    category: 'ui-library',
    description:
      'Modern container query utilities for responsive components that adapt to their container width instead of the viewport.',
    tags: ['container-queries', 'modern-css', 'responsive'],
    npmPackage: '@tailwindcss/container-queries',
  },
];

/*
 * ==========================================================================
 * 3. Animation & Motion Libraries (70+ items)
 * ==========================================================================
 */
export const ANIMATION_LIBRARIES: CatalogItem[] = [
  {
    id: 'framer-motion',
    name: 'Framer Motion',
    category: 'animation',
    description:
      'Production-ready motion library for React with declarative physics springs, gestures, layout transitions, and AnimatePresence.',
    tags: ['react', 'springs', 'gestures', 'layout', 'standard'],
    npmPackage: 'framer-motion',
    badge: 'React Standard',
  },
  {
    id: 'gsap-core',
    name: 'GSAP (GreenSock) Core',
    category: 'animation',
    description:
      'Industry gold standard high-performance JavaScript animation engine. Smooth 60fps tweens, timeline choreography, and zero lag.',
    tags: ['gsap', 'timeline', '60fps', 'high-performance'],
    npmPackage: 'gsap',
    badge: 'Industry Standard',
  },
  {
    id: 'gsap-scrolltrigger',
    name: 'GSAP ScrollTrigger',
    category: 'animation',
    description:
      'Cinema-grade scroll animations, pin scrubbing, horizontal parallax, and viewport progress tracking with GSAP.',
    tags: ['gsap', 'scroll', 'parallax', 'scrubbing'],
    npmPackage: 'gsap',
    badge: 'Awwwards Classic',
  },
  {
    id: 'gsap-flip',
    name: 'GSAP Flip Plugin',
    category: 'animation',
    description:
      'FLIP (First, Last, Invert, Play) technique for seamless layout morphing, grid reordering, and element state transitions.',
    tags: ['gsap', 'flip', 'layout-morph', 'smooth'],
    npmPackage: 'gsap',
  },
  {
    id: 'gsap-splittext',
    name: 'GSAP SplitText / Kinetic Type',
    category: 'animation',
    description:
      'Split headings and body text into lines, words, and characters for staggered kinetic reveals and editorial motion.',
    tags: ['gsap', 'typography', 'kinetic', 'split-text'],
    npmPackage: 'split-type gsap',
  },
  {
    id: 'lenis',
    name: 'Lenis Smooth Scroll',
    category: 'animation',
    description:
      'Ultra-smooth momentum scrolling library by Studio Freight. Lightweight, accessible, and works seamlessly with GSAP.',
    tags: ['smooth-scroll', 'momentum', 'inertia', 'modern'],
    npmPackage: '@studio-freight/lenis',
    badge: 'Studio Freight',
  },
  {
    id: 'threejs',
    name: 'Three.js (WebGL 3D)',
    category: 'animation',
    description:
      'The premier JavaScript 3D engine for rendering WebGL scenes, interactive meshes, PBR shaders, and particle fields.',
    tags: ['3d', 'webgl', 'shaders', 'geometry'],
    npmPackage: 'three',
    badge: '3D WebGL',
  },
  {
    id: 'r3f',
    name: 'React Three Fiber (R3F)',
    category: 'animation',
    description:
      'Declarative React renderer for Three.js. Build complex 3D scenes with standard React component composition and state.',
    tags: ['react', 'threejs', '3d', 'declarative'],
    npmPackage: '@react-three/fiber three',
  },
  {
    id: 'drei',
    name: '@react-three/drei',
    category: 'animation',
    description:
      'Essential helper primitives and abstractions for React Three Fiber (OrbitControls, Text3D, Float, MeshDistort, Stars).',
    tags: ['r3f', 'helpers', 'orbit-controls', '3d-text'],
    npmPackage: '@react-three/drei',
  },
  {
    id: 'animejs',
    name: 'Anime.js v3',
    category: 'animation',
    description:
      'Lightweight JavaScript animation engine with a clean API for animating CSS properties, SVG paths, DOM attributes, and JS objects.',
    tags: ['svg', 'lightweight', 'stagger', 'keyframes'],
    npmPackage: 'animejs',
  },
  {
    id: 'motion-one',
    name: 'Motion One (WAAPI)',
    category: 'animation',
    description:
      'The smallest, fastest animation library powered by the native Web Animations API (WAAPI) for hardware-accelerated 120fps motion.',
    tags: ['waapi', 'hardware-accelerated', 'ultra-fast'],
    npmPackage: 'motion',
  },
  {
    id: 'pixijs',
    name: 'Pixi.js v8',
    category: 'animation',
    description:
      'The HTML5 2D creation engine. Ultra-fast WebGL 2D renderer for rich interactive games, canvas simulations, and VFX.',
    tags: ['2d', 'webgl', 'sprites', 'canvas', 'fast'],
    npmPackage: 'pixi.js',
  },
  {
    id: 'matter-js',
    name: 'Matter.js (2D Physics)',
    category: 'animation',
    description:
      '2D rigid body physics engine for web. Simulates gravity, collisions, restitution, friction, constraints, and ragdolls.',
    tags: ['physics', '2d', 'gravity', 'rigid-body'],
    npmPackage: 'matter-js',
    badge: 'Physics Engine',
  },
  {
    id: 'rapier-physics',
    name: 'Rapier.js (Rust/WASM Physics)',
    category: 'animation',
    description:
      'Fast 2D and 3D physics engine written in Rust and compiled to WebAssembly. Deterministic and highly optimized.',
    tags: ['rust', 'wasm', 'physics', 'high-performance'],
    npmPackage: '@dimforge/rapier3d-compat',
  },
  {
    id: 'cannon-es',
    name: 'Cannon-es (3D Physics)',
    category: 'animation',
    description:
      'Lightweight and fast 3D physics engine for Three.js. Supports rigid bodies, compounds, contacts, and cloth simulations.',
    tags: ['threejs', '3d-physics', 'rigid-body'],
    npmPackage: 'cannon-es',
  },
  {
    id: 'canvas-confetti',
    name: 'Canvas Confetti',
    category: 'animation',
    description:
      'High-performance celebratory confetti explosions rendered on HTML5 canvas with realistic gravity and wind vectors.',
    tags: ['confetti', 'particles', 'celebration', 'gamification'],
    npmPackage: 'canvas-confetti',
    badge: 'Gamification',
  },
  {
    id: 'tsparticles',
    name: 'tsParticles',
    category: 'animation',
    description:
      'Easily create highly customizable interactive particle effects, constellation meshes, floating dust, and snow backdrops.',
    tags: ['particles', 'mesh', 'interactive', 'constellations'],
    npmPackage: '@tsparticles/react tsparticles',
  },
  {
    id: 'spline-runtime',
    name: 'Spline Runtime Web',
    category: 'animation',
    description:
      'Embed real-time interactive 3D web scenes directly designed in Spline with reactive state transitions and camera controls.',
    tags: ['spline', '3d', 'interactive', 'designer-friendly'],
    npmPackage: '@splinetool/react-spline',
    badge: 'Spline 3D',
  },
  {
    id: 'lottie-web',
    name: 'Lottie Web',
    category: 'animation',
    description:
      'Renders Adobe After Effects animations exported with Bodymovin directly as vector SVG or Canvas animations.',
    tags: ['after-effects', 'vector', 'lottie', 'svg'],
    npmPackage: 'lottie-web',
  },
  {
    id: 'dotlottie',
    name: 'DotLottie Web',
    category: 'animation',
    description:
      'Open-source file format and player that aggregates one or more Lottie animations into a tiny, high-performance compressed package.',
    tags: ['dotlottie', 'vector', 'compressed', 'fast'],
    npmPackage: '@dotlottie/player-component',
  },
  {
    id: 'rive-web',
    name: 'Rive Web / Canvas',
    category: 'animation',
    description:
      'Real-time interactive state-machine vector graphics. Tiny file sizes, 60fps performance, and dynamic user inputs.',
    tags: ['rive', 'state-machine', 'interactive', 'vector'],
    npmPackage: '@rive-app/canvas',
    badge: 'Interactive Vector',
  },
  {
    id: 'typed-js',
    name: 'Typed.js',
    category: 'animation',
    description:
      'A JavaScript library that simulates real typewriter effects. Types out text, pauses, deletes, and loops dynamically.',
    tags: ['typewriter', 'terminal', 'text-animation'],
    npmPackage: 'typed.js',
  },
  {
    id: 'baffle-js',
    name: 'Baffle.js (Glitch Text)',
    category: 'animation',
    description:
      'A tiny JavaScript library for obfuscating, scrambling, and revealing text with cyberpunk terminal characters.',
    tags: ['glitch', 'cyberpunk', 'text-scramble', 'terminal'],
    npmPackage: 'baffle',
  },
  {
    id: 'split-type',
    name: 'SplitType',
    category: 'animation',
    description:
      'Splits text into characters, words, and lines to enable fine-grained CSS and JS kinetic typography animations.',
    tags: ['typography', 'split', 'kinetic-text'],
    npmPackage: 'split-type',
  },
  {
    id: 'vanilla-tilt',
    name: 'Vanilla-Tilt.js',
    category: 'animation',
    description:
      'Smooth 3D tilt hover effect for cards and images based on mouse position. Pure vanilla JS with zero dependencies.',
    tags: ['3d-tilt', 'parallax', 'cards', 'tactile'],
    npmPackage: 'vanilla-tilt',
  },
  {
    id: 'atropos',
    name: 'Atropos 3D Parallax',
    category: 'animation',
    description:
      'Touch-friendly 3D parallax hover effect with multi-layered depth, realistic shadows, and smooth touch tracking.',
    tags: ['parallax', '3d', 'touch-friendly', 'depth'],
    npmPackage: 'atropos',
  },
  {
    id: 'kute-js',
    name: 'KUTE.js',
    category: 'animation',
    description:
      'Ultra-fast JavaScript animation engine specialized in complex SVG path morphing, stroke drawing, and CSS transforms.',
    tags: ['svg-morph', 'morphing', 'svg-paths'],
    npmPackage: 'kute.js',
  },
  {
    id: 'vivus-js',
    name: 'Vivus.js (SVG Stroke Drawing)',
    category: 'animation',
    description:
      'Lightweight JavaScript class (no dependencies) to animate SVG paths giving them the appearance of being drawn in real time.',
    tags: ['svg', 'stroke-drawing', 'vector', 'line-art'],
    npmPackage: 'vivus',
  },
  {
    id: 'rough-js',
    name: 'Rough.js',
    category: 'animation',
    description: 'Draw graphics with a hand-drawn, sketchy, comic-book appearance on HTML5 Canvas or SVG.',
    tags: ['hand-drawn', 'sketch', 'creative', 'canvas'],
    npmPackage: 'roughjs',
  },
  {
    id: 'two-js',
    name: 'Two.js',
    category: 'animation',
    description:
      'Two-dimensional drawing API for the modern web that renders across SVG, Canvas 2D, and WebGL interchangeably.',
    tags: ['2d-drawing', 'svg', 'canvas', 'webgl'],
    npmPackage: 'two.js',
  },
  {
    id: 'paper-js',
    name: 'Paper.js',
    category: 'animation',
    description:
      'The Swiss Army Knife of Vector Graphics Scripting. Bezier curve manipulation, boolean paths, and vector geometry.',
    tags: ['vector', 'bezier', 'geometry', 'canvas'],
    npmPackage: 'paper',
  },
  {
    id: 'fabric-js',
    name: 'Fabric.js',
    category: 'animation',
    description:
      'Powerful and simple HTML5 canvas library providing an interactive object model, draggable shapes, text, and SVG parser.',
    tags: ['canvas', 'interactive-editor', 'shapes', 'draggables'],
    npmPackage: 'fabric',
  },
  {
    id: 'konva-js',
    name: 'Konva.js / React-Konva',
    category: 'animation',
    description:
      '2D canvas framework for desktop and mobile applications. High-performance dragging, multi-touch, filtering, and animation.',
    tags: ['canvas', 'drag-drop', 'multi-touch', 'react-konva'],
    npmPackage: 'konva react-konva',
  },
  {
    id: 'p5-js',
    name: 'P5.js (Creative Coding)',
    category: 'animation',
    description:
      'JavaScript library for creative coding with an accessible interface for generative art, simulations, and algorithmic visuals.',
    tags: ['generative-art', 'creative-coding', 'algorithms'],
    npmPackage: 'p5',
  },
  {
    id: 'curtains-js',
    name: 'Curtains.js (WebGL Shaders)',
    category: 'animation',
    description:
      'Small WebGL library that converts HTML elements (images, videos, canvases) into interactive 3D WebGL textured planes.',
    tags: ['webgl', 'shaders', 'distortion', 'liquid-image'],
    npmPackage: 'curtainsjs',
  },
  {
    id: 'hover-effect',
    name: 'Hover-Effect (WebGL Displacement)',
    category: 'animation',
    description:
      'JavaScript library to animate images on hover with fluid WebGL liquid displacement shader transitions.',
    tags: ['webgl', 'distortion', 'shaders', 'image-reveal'],
  },
  {
    id: 'locomotive-scroll',
    name: 'Locomotive Scroll',
    category: 'animation',
    description:
      'Smooth scrolling library with element parallax detection, skew effects, sticky pinned sections, and in-view triggers.',
    tags: ['smooth-scroll', 'parallax', 'skew', 'awwwards'],
    npmPackage: 'locomotive-scroll',
  },
  {
    id: 'scrollreveal',
    name: 'ScrollReveal.js',
    category: 'animation',
    description:
      'Easy scroll animations for web and mobile browsers. Declaratively animate DOM elements as they enter the viewport.',
    tags: ['scroll', 'reveal', 'viewport', 'declarative'],
    npmPackage: 'scrollreveal',
  },
  {
    id: 'aos',
    name: 'AOS (Animate On Scroll)',
    category: 'animation',
    description:
      'CSS-driven "Animate on Scroll" library. Configure animations directly on HTML tags with data-aos attributes.',
    tags: ['scroll', 'css-animations', 'declarative'],
    npmPackage: 'aos',
  },
  {
    id: 'wow-js',
    name: 'WOW.js',
    category: 'animation',
    description: 'Reveal CSS animations as you scroll down the page. Easily triggers Animate.css animations on scroll.',
    tags: ['scroll', 'animate-css', 'classic'],
    npmPackage: 'wow.js',
  },
  {
    id: 'animate-css',
    name: 'Animate.css',
    category: 'animation',
    description:
      'A library of ready-to-use, cross-browser CSS animations. Bounce, flash, pulse, rubberBand, shake, swing, tada, wobble, and fades.',
    tags: ['css-keyframes', 'ready-to-use', 'classic'],
    npmPackage: 'animate.css',
  },
  {
    id: 'magic-css',
    name: 'Magic CSS Animations',
    category: 'animation',
    description:
      'CSS3 animations with special effects like puffIn, magic, swap, slide, puffOut, vanishIn, and perspective zooms.',
    tags: ['css-animations', 'special-effects'],
  },
  {
    id: 'micron-js',
    name: 'Micron.js',
    category: 'animation',
    description: 'Micro-interaction library powered by CSS animations and controlled by JavaScript DOM events.',
    tags: ['micro-interactions', 'subtle', 'css-powered'],
  },
  {
    id: 'popmotion',
    name: 'Popmotion',
    category: 'animation',
    description:
      'The functional, reactive animation engine powering Framer Motion. Pure physics springs, decays, keyframes, and inertia.',
    tags: ['springs', 'functional', 'physics', 'decay'],
    npmPackage: 'popmotion',
  },
  {
    id: 'just-animate',
    name: 'Just-Animate (WAAPI)',
    category: 'animation',
    description:
      'Modern Web Animations API tool for choreographing timelines, sequencing, and hardware-accelerated animations.',
    tags: ['waapi', 'timeline', 'sequencing'],
    npmPackage: 'just-animate',
  },
  {
    id: 'barba-js',
    name: 'Barba.js',
    category: 'animation',
    description:
      'Fluid, smooth page transitions between web pages using PJAX and Web History API. Create native app-like page changes.',
    tags: ['page-transitions', 'pjax', 'spa-feel', 'awwwards'],
    npmPackage: '@barba/core',
  },
  {
    id: 'swiper-js',
    name: 'Swiper.js',
    category: 'animation',
    description:
      'The most modern mobile touch slider with hardware-accelerated transitions, 3D cubes, cards, coverflow, and thumbs.',
    tags: ['slider', 'carousel', 'touch-swipe', '3d-effects'],
    npmPackage: 'swiper',
    badge: 'Slider Standard',
  },
  {
    id: 'embla-carousel',
    name: 'Embla Carousel',
    category: 'animation',
    description:
      'A lightweight carousel library with fluid physics and zero dependencies. 100% accessible and framework agnostic.',
    tags: ['carousel', 'lightweight', 'physics', 'accessible'],
    npmPackage: 'embla-carousel-react',
  },
  {
    id: 'keen-slider',
    name: 'Keen-Slider',
    category: 'animation',
    description:
      'Touch-optimized responsive slider with native touch feeling and zero dependencies. Works in React, Vue, Svelte, and JS.',
    tags: ['slider', 'touch', 'smooth-drag', 'responsive'],
    npmPackage: 'keen-slider',
  },
  {
    id: 'splide',
    name: 'Splide.js',
    category: 'animation',
    description:
      'Lightweight, flexible and accessible slider and carousel written in pure TypeScript without any dependencies.',
    tags: ['carousel', 'typescript', 'accessible'],
    npmPackage: '@splidejs/react-splide',
  },
  {
    id: 'countup-js',
    name: 'CountUp.js',
    category: 'animation',
    description:
      'Animates numerical values smoothly from zero with easing curves, formatting, prefixes, suffixes, and decimals.',
    tags: ['numbers', 'counter', 'stats', 'telemetry'],
    npmPackage: 'countup.js',
  },
  {
    id: 'odometer',
    name: 'Odometer (Mechanical Counter)',
    category: 'animation',
    description:
      'Smoothly rolls numbers like an old car odometer or mechanical ticker. Distinctive CSS 3D number reel transforms.',
    tags: ['odometer', 'mechanical', 'number-roll', 'retro'],
    npmPackage: 'odometer',
  },
  {
    id: 'howler-js',
    name: 'Howler.js (Web Audio SFX)',
    category: 'animation',
    description:
      'Audio library for the modern web. Enables spatial sound, button click SFX, ambient audio loops, and sound sprites.',
    tags: ['audio', 'sfx', 'spatial-sound', 'tactile-audio'],
    npmPackage: 'howler',
  },
  {
    id: 'tone-js',
    name: 'Tone.js (Synthesizer & Audio)',
    category: 'animation',
    description:
      'Web Audio framework for creating interactive music, synths, generative chimes, and micro-audio feedback in the browser.',
    tags: ['synthesizer', 'generative-music', 'web-audio'],
    npmPackage: 'tone',
  },
  {
    id: 'zdog',
    name: 'Zdog (Pseudo-3D Engine)',
    category: 'animation',
    description:
      'Round, flat, designer-friendly pseudo-3D engine for Canvas & SVG. Cute illustrative 3D vector graphics by Metafizzy.',
    tags: ['pseudo-3d', 'illustrative', 'cute', 'metafizzy'],
    npmPackage: 'zdog',
  },
  {
    id: 'granim-js',
    name: 'Granim.js (Fluid Gradients)',
    category: 'animation',
    description:
      'Create fluid, flowing and interactive gradient animations on HTML5 canvas with seamless color transitions.',
    tags: ['gradient', 'canvas', 'fluid-color', 'ambient'],
    npmPackage: 'granim',
  },
  {
    id: 'trianglify',
    name: 'Trianglify',
    category: 'animation',
    description:
      'Algorithmically generates beautiful low-poly Delaunay triangulation geometric patterns and colorful meshes.',
    tags: ['generative', 'delaunay', 'geometric', 'low-poly'],
    npmPackage: 'trianglify',
  },
  {
    id: 'vanta-js',
    name: 'Vanta.js (3D Backgrounds)',
    category: 'animation',
    description:
      'Animated 3D website backgrounds in a few lines of code (Birds, Waves, Net, Fog, Clouds, Rings, Halo, Cells, Globe).',
    tags: ['3d-background', 'threejs', 'ambient-vfx'],
    npmPackage: 'vanta',
  },
  {
    id: 'particles-js',
    name: 'Particles.js',
    category: 'animation',
    description:
      'The classic lightweight JavaScript library for creating interactive floating particle backgrounds and nodes.',
    tags: ['particles', 'classic', 'nodes', 'background'],
    npmPackage: 'particles.js',
  },
  {
    id: 'parallax-js',
    name: 'Parallax.js',
    category: 'animation',
    description:
      'Simple, lightweight Parallax Engine that reacts to the orientation of a smart device or mouse pointer.',
    tags: ['parallax', 'gyroscope', 'orientation'],
    npmPackage: 'parallax-js',
  },
  {
    id: 'rellax',
    name: 'Rellax.js',
    category: 'animation',
    description: 'A buttery smooth, super lightweight, vanilla JavaScript parallax library for scrolling elements.',
    tags: ['parallax', 'smooth', 'vanilla-js'],
    npmPackage: 'rellax',
  },
  {
    id: 'jarallax',
    name: 'Jarallax',
    category: 'animation',
    description: 'Smooth parallax scrolling effect for background images, YouTube, and Vimeo video containers.',
    tags: ['parallax', 'video-background', 'image-parallax'],
    npmPackage: 'jarallax',
  },
  {
    id: 'luxy-js',
    name: 'Luxy.js (Inertial Scroll)',
    category: 'animation',
    description: 'Inertial smooth scrolling and momentum parallax library for lightweight DOM elements.',
    tags: ['inertia', 'momentum', 'smooth-scroll'],
  },
  {
    id: 'smooth-scrollbar',
    name: 'Smooth Scrollbar',
    category: 'animation',
    description:
      'Customizable, high-performance smooth scrollbars that replace native browser scrolling with momentum physics.',
    tags: ['scrollbar', 'momentum', 'custom-ui'],
    npmPackage: 'smooth-scrollbar',
  },
  {
    id: 'driver-js',
    name: 'Driver.js (Guided Spotlight)',
    category: 'animation',
    description:
      'Lightweight, zero-dependency vanilla JavaScript engine to drive user focus across your page with animated spotlight masks.',
    tags: ['tour', 'onboarding', 'spotlight', 'guided-walk'],
    npmPackage: 'driver.js',
  },
  {
    id: 'shepherd-js',
    name: 'Shepherd.js',
    category: 'animation',
    description: 'Guide your users through a tour of your app with floating callouts, steps, and progress bars.',
    tags: ['tour', 'onboarding', 'tooltips'],
    npmPackage: 'shepherd.js',
  },
  {
    id: 'react-joyride',
    name: 'React Joyride',
    category: 'animation',
    description:
      'Create awesome guided tours for your React apps with beacon indicators, tooltips, and customizable themes.',
    tags: ['tour', 'react', 'onboarding', 'beacons'],
    npmPackage: 'react-joyride',
  },
  {
    id: 'autosize',
    name: 'Autosize',
    category: 'animation',
    description:
      'Small, stand-alone script to automatically adjust textarea height to fit text dynamically without scrollbars.',
    tags: ['textarea', 'elastic-input', 'smooth-height'],
    npmPackage: 'autosize',
  },
];

/*
 * ==========================================================================
 * 4. 2026 Visual FX Commodities & UI Patterns (50+ items)
 * ==========================================================================
 */
export const COMMODITIES_AND_EFFECTS: CatalogItem[] = [
  {
    id: 'conic-border-beam',
    name: 'Conic Border Beams',
    category: 'commodity',
    description:
      'Continuous rotating luminous border beam powered by @property --beam-angle and conic-gradient with zero JS overhead.',
    tags: ['conic-gradient', 'border-beam', 'magic-ui', 'glow'],
    badge: '2026 Signature',
  },
  {
    id: 'aurora-mesh-gradient',
    name: 'Aurora Mesh Gradient',
    category: 'commodity',
    description:
      'Multi-layer radial-gradient mesh with fluid breathing keyframes, simulating northern lights and organic color pools.',
    tags: ['aurora', 'mesh', 'background', 'breathing-light'],
    badge: 'Ambient Luxury',
  },
  {
    id: 'frosted-glass-paywall',
    name: 'Frosted Glass Paywall Blur',
    category: 'commodity',
    description:
      'Tactile backdrop-filter: blur(8px) paywall blur with high-contrast glowing Lock Overlay Card and dual checkout rails.',
    tags: ['paywall', 'blur', 'monetization', 'conversion'],
    badge: 'Monetization Invariant',
  },
  {
    id: 'shimmer-gold-text',
    name: 'Shimmer Gold Typography',
    category: 'commodity',
    description:
      'Metallic linear gradient text sweep with smooth 3-second infinite shimmer keyframe animation in Imperial Gold.',
    tags: ['typography', 'shimmer', 'metallic', 'gold'],
  },
  {
    id: 'kinetic-slam-hero',
    name: 'Kinetic Slam Hero Typography',
    category: 'commodity',
    description:
      'Viewport-clamped oversized typography (clamp(2.5rem, 8vw, 7rem)) with tracking-tighter and instant punchy visual impact.',
    tags: ['hero', 'oversized', 'clamp', 'kinetic', 'slam'],
  },
  {
    id: 'bento-grid',
    name: 'Asymmetric Bento Grid',
    category: 'commodity',
    description:
      'Modular Bento-box layout with variable column spans (col-span-12 md:col-span-8), subtle border glows, and tactile cards.',
    tags: ['bento', 'grid', 'cards', 'apple-style', 'modular'],
    badge: 'Layout Standard',
  },
  {
    id: 'spotlight-reveal',
    name: 'Ambient Spotlight Reveal',
    category: 'commodity',
    description:
      'Mouse-following radial gradient overlay that illuminates card borders and surface details as the cursor glides across.',
    tags: ['spotlight', 'mouse-follow', 'card-glow', 'subtle'],
  },
  {
    id: 'dot-grid-matrix',
    name: 'Dot Grid Matrix Canvas',
    category: 'commodity',
    description:
      'Subtle technical background pattern using CSS radial-gradient dots (1px dot on 24px grid) with radial mask vignette fade.',
    tags: ['background', 'matrix', 'dots', 'blueprint', 'technical'],
  },
  {
    id: 'blueprint-grid',
    name: 'Architectural Blueprint Grid',
    category: 'commodity',
    description:
      'CAD-style linear coordinate grid with crosshairs, sub-pixel millimeter ticks, and subtle corner rulers.',
    tags: ['blueprint', 'grid', 'engineering', 'crosshairs'],
  },
  {
    id: 'noise-film-grain',
    name: 'Analog Noise & Film Grain Overlay',
    category: 'commodity',
    description:
      'Subtle SVG feTurbulence grain texture with mix-blend-mode: overlay to eliminate digital flatness and add analog tactile depth.',
    tags: ['noise', 'grain', 'analog', 'tactile', 'texture'],
  },
  {
    id: 'glassmorphic-dock',
    name: 'Glassmorphic Floating HUD Dock',
    category: 'commodity',
    description:
      'Pill-shaped floating navigation bar with backdrop-blur-xl, subtle 1px border, spring icon magnification, and active indicators.',
    tags: ['dock', 'hud', 'pill', 'floating-nav', 'macos'],
  },
  {
    id: 'retro-crt-scanlines',
    name: 'Retro CRT Scanlines & Flicker',
    category: 'commodity',
    description:
      'Phosphor green/amber terminal overlay with subtle horizontal scanlines, curved CRT glass barrel distortion, and scan beam.',
    tags: ['crt', 'retro', 'terminal', 'scanlines', 'cyberpunk'],
  },
  {
    id: 'magnetic-button',
    name: 'Magnetic Cursor Button',
    category: 'commodity',
    description:
      'Button that magnetically tugs toward the cursor when hovering nearby using spring displacement calculations.',
    tags: ['magnetic', 'button', 'cursor-pull', 'delight'],
  },
  {
    id: 'parallax-tilt-card',
    name: '3D Parallax Tilt Card',
    category: 'commodity',
    description:
      'Card with 3D perspective transform (rotateX, rotateY) that tilts realistically following cursor coordinates with glare sheen.',
    tags: ['3d-tilt', 'card', 'perspective', 'glare'],
  },
  {
    id: 'radar-sonar-rings',
    name: 'Radar Sonar Telemetry Rings',
    category: 'commodity',
    description:
      'Concentric pulsing circle rings that expand outwards from live indicators to denote active node connections or server status.',
    tags: ['radar', 'sonar', 'pulse', 'telemetry', 'status'],
  },
  {
    id: 'infinite-marquee',
    name: 'Infinite Marquee Ticker',
    category: 'commodity',
    description:
      'Hardware-accelerated horizontal scrolling marquee ribbon with pause-on-hover for tech stacks, sponsors, and social proof.',
    tags: ['marquee', 'ticker', 'infinite-scroll', 'gpu'],
  },
  {
    id: 'interactive-scratch-card',
    name: 'Interactive Canvas Scratch Card',
    category: 'commodity',
    description:
      'HTML5 canvas brush overlay that users can scratch off to reveal secret promotional discount codes or hidden perks.',
    tags: ['scratch-card', 'gamification', 'discount', 'interactive'],
  },
  {
    id: 'confetti-cannon-burst',
    name: 'Confetti Cannon Trigger',
    category: 'commodity',
    description:
      'Celebratory particle explosion fired on form completion, order placement, or milestone achievement with custom brand colors.',
    tags: ['confetti', 'celebration', 'reward', 'conversion'],
  },
  {
    id: 'cyberpunk-hud-corners',
    name: 'Cyberpunk HUD Corner Brackets',
    category: 'commodity',
    description:
      'Targeting L-brackets on card corners with high-tech crosshairs, telemetry coordinates, and glowing accent nodes.',
    tags: ['hud', 'cyberpunk', 'brackets', 'targeting'],
  },
  {
    id: 'neon-cyber-glow',
    name: 'Multi-Tier Neon Cyber Glow',
    category: 'commodity',
    description:
      'Layered drop-shadows and box-shadows in high-frequency cyan, magenta, and electric lime with intense luminescence.',
    tags: ['neon', 'glow', 'luminescence', 'vibrant'],
  },
  {
    id: 'neumorphic-soft-surface',
    name: 'Neumorphic Soft Extruded Surface',
    category: 'commodity',
    description:
      'Tactile dual-shadow embossed buttons and recessed wells with soft realistic light angles and tactile depressions.',
    tags: ['neumorphism', 'soft-ui', 'embossed', 'tactile'],
  },
  {
    id: 'holographic-foil-sheen',
    name: 'Holographic Iridescent Foil Sheen',
    category: 'commodity',
    description:
      'Angular iridescent rainbow gradient shift that changes hue based on cursor angle like a luxury foil-stamped trading card.',
    tags: ['holographic', 'foil', 'iridescent', 'luxury'],
  },
  {
    id: 'stepped-glass-tabs',
    name: 'Stepped Glass Segmented Tabs',
    category: 'commodity',
    description:
      'Segmented pill control with a sliding frosted glass active pill indicator powered by layoutId springs.',
    tags: ['tabs', 'segmented-control', 'glass', 'spring'],
  },
  {
    id: 'rolling-odometer-ticker',
    name: 'Mechanical Odometer Number Roll',
    category: 'commodity',
    description:
      'Vertical cylinder rolling numbers for real-time counters, user milestones, and treasury earnings tracking.',
    tags: ['odometer', 'numbers', 'ticker', 'mechanical'],
  },
  {
    id: 'floating-ambient-orbs',
    name: 'Floating Ambient Color Orbs',
    category: 'commodity',
    description:
      'Large blurred spheres (filter: blur(80px)) slowly floating and pulsing across the viewport background.',
    tags: ['orbs', 'ambient', 'floating', 'blur'],
  },
  {
    id: 'perspective-device-mockup',
    name: '3D Angled Device Mockup Frame',
    category: 'commodity',
    description:
      'Perspective-rotated browser chrome or mobile smartphone mockup displaying the live app with realistic drop shadow.',
    tags: ['mockup', 'perspective', 'device-frame', 'showcase'],
  },
  {
    id: 'horizontal-scroll-gallery',
    name: 'Sticky Pinned Horizontal Gallery',
    category: 'commodity',
    description:
      'Section that pins in place while user scrolls vertically, sliding an oversized card reel horizontally across the screen.',
    tags: ['horizontal-scroll', 'sticky', 'gallery', 'showreel'],
  },
  {
    id: 'aperture-shutter-entrance',
    name: 'Aperture Shutter Curtain Entrance',
    category: 'commodity',
    description:
      'Cinematic page load reveal where split dark panels slide apart vertically or diagonally to reveal the hero application.',
    tags: ['aperture', 'shutter', 'entrance', 'cinematic'],
  },
  {
    id: 'gooey-liquid-filter',
    name: 'Liquid Gooey SVG Filter',
    category: 'commodity',
    description:
      'SVG filter combining Gaussian blur and high-contrast color matrix to create fluid blob merging and separating liquid droplets.',
    tags: ['gooey', 'liquid', 'svg-filter', 'blobs'],
  },
  {
    id: 'chromatic-aberration-glitch',
    name: 'Chromatic Aberration Glitch Hover',
    category: 'commodity',
    description:
      'Instant RGB color-channel offset on hover or click with rapid twitch keyframes for high-energy tech products.',
    tags: ['glitch', 'chromatic-aberration', 'rgb-split'],
  },
  {
    id: 'audio-reactive-waveform',
    name: 'Audio Reactive Frequency Waveform',
    category: 'commodity',
    description:
      'Live HTML5 canvas animated vertical equalizer bars responding to audio playback or simulated ambient frequencies.',
    tags: ['audio', 'waveform', 'equalizer', 'canvas'],
  },
  {
    id: 'dynamic-island-pill',
    name: 'Dynamic Island Fluid Header Pill',
    category: 'commodity',
    description:
      'Compact black pill in the top header that smoothly morphs in width and height using spring physics to show notifications.',
    tags: ['dynamic-island', 'pill', 'fluid-morph', 'apple'],
  },
  {
    id: 'dual-checkout-box',
    name: 'Dual Checkout Conversion Rail (Stripe + Solana)',
    category: 'commodity',
    description:
      'Side-by-side high-conversion payment widget with instant credit card checkout + 1-click Solana crypto pay.',
    tags: ['checkout', 'stripe', 'solana', 'crypto', 'conversion'],
    badge: 'Conversion Engine',
  },
  {
    id: 'founding-urgency-banner',
    name: 'Founding Member Urgency Banner',
    category: 'commodity',
    description:
      'Top glass bar with live seat counter, discount strikethrough ($19 vs $79), and pulsing live status badge.',
    tags: ['urgency', 'banner', 'founding-members', 'sales'],
  },
  {
    id: 'interactive-price-slider',
    name: 'Interactive Dynamic Pricing Calculator',
    category: 'commodity',
    description:
      'Smooth slider calculating estimated ROI, monthly usage units, and dynamically switching recommendation tier cards.',
    tags: ['pricing', 'calculator', 'slider', 'interactive'],
  },
  {
    id: 'testimonial-bento-wall',
    name: 'Masonry Social Proof Bento Wall',
    category: 'commodity',
    description:
      'Asymmetric grid of verified customer tweets, quotes, avatar clusters, and star ratings with subtle tilt.',
    tags: ['testimonials', 'social-proof', 'masonry', 'trust'],
  },
  {
    id: 'split-code-runner',
    name: 'Split Code Editor & Live Preview',
    category: 'commodity',
    description:
      'Two-pane developer layout with syntax-highlighted editor on left and live executing iframe preview on right.',
    tags: ['code-runner', 'editor', 'live-preview', 'developer'],
  },
  {
    id: 'spring-faq-accordion',
    name: 'Spring-Physics FAQ Accordion',
    category: 'commodity',
    description:
      'FAQ disclosure list with smooth height animation, rotating plus/minus chevron, and accessible ARIA attributes.',
    tags: ['faq', 'accordion', 'spring', 'accessible'],
  },
  {
    id: 'feature-comparison-matrix',
    name: 'Feature Comparison Checkmark Matrix',
    category: 'commodity',
    description:
      'Side-by-side tier comparison table with sticky headers, feature categories, and highlighted recommended plan column.',
    tags: ['table', 'comparison', 'pricing-matrix', 'checkmarks'],
  },
  {
    id: 'command-palette-cmdk',
    name: 'Command Palette (CMD+K) Overlay',
    category: 'commodity',
    description: 'Fast keyboard-driven search and action modal with fuzzy matching, breadcrumbs, and shortcut hints.',
    tags: ['cmdk', 'command-palette', 'keyboard', 'quick-actions'],
  },
  {
    id: 'breadcrumb-telemetry',
    name: 'Breadcrumb Telemetry Path Trail',
    category: 'commodity',
    description: 'Terminal-style directory breadcrumb path bar with copy button, branch badge, and latency indicator.',
    tags: ['breadcrumbs', 'telemetry', 'path', 'terminal'],
  },
  {
    id: 'interactive-palette-canvas',
    name: 'Live Color Harmony Canvas Builder',
    category: 'commodity',
    description:
      'Interactive color wheel and contrast checker displaying real-time WCAG accessibility compliance scores.',
    tags: ['color-picker', 'wcag', 'contrast', 'accessibility'],
  },
  {
    id: 'markdown-doc-renderer',
    name: 'Live GitHub-Flavored Markdown View',
    category: 'commodity',
    description:
      'Formatted documentation pane with code syntax highlighting, copy buttons, and auto-generated table of contents.',
    tags: ['markdown', 'docs', 'syntax-highlight', 'toc'],
  },
  {
    id: 'workspace-tree-explorer',
    name: 'Interactive File Tree Explorer',
    category: 'commodity',
    description:
      'Collapsible folder and file hierarchy tree with file icons, uncommitted change badges, and active file highlight.',
    tags: ['file-tree', 'explorer', 'ide', 'hierarchy'],
  },
  {
    id: 'telemetry-stream-console',
    name: 'Live Telemetry Log Stream Console',
    category: 'commodity',
    description:
      'Monospace terminal log window with auto-scroll lock, log level color coding, and filter search input.',
    tags: ['logs', 'console', 'terminal', 'telemetry'],
  },
  {
    id: 'stacked-toast-queue',
    name: 'Stacked Dynamic Toast Queue',
    category: 'commodity',
    description:
      'Notification queue appearing at bottom-right with spring entrance, stacking cards, and swipe-to-dismiss gesture.',
    tags: ['toast', 'notifications', 'stack', 'spring'],
  },
  {
    id: 'cinematic-video-hero-modal',
    name: 'Cinematic Showreel Video Hero Modal',
    category: 'commodity',
    description:
      'Modal dialog with dark glass backdrop, auto-playing video demo reel, playback scrubber, and full-screen trigger.',
    tags: ['video', 'showreel', 'modal', 'cinematic'],
    badge: 'Video Standard',
  },
];

/*
 * ==========================================================================
 * 5. Distinctive Typography Pairings (40+ items)
 * ==========================================================================
 */
export const TYPOGRAPHY_PAIRINGS: CatalogItem[] = [
  {
    id: 'syne-space-grotesk',
    name: 'Syne + Space Grotesk',
    category: 'typography',
    description:
      'Avant-garde sculptural headings paired with technical mono-flavored body. Bold, artistic, and futuristic.',
    tags: ['syne', 'space-grotesk', 'avant-garde', 'futuristic'],
    badge: 'ZothOS Signature',
  },
  {
    id: 'cabinet-satoshi',
    name: 'Cabinet Grotesk + Satoshi',
    category: 'typography',
    description: 'Ultra-modern European editorial aesthetic. High-fashion headlines with clean geometric legibility.',
    tags: ['cabinet-grotesk', 'satoshi', 'editorial', 'fashion'],
    badge: 'Modern Editorial',
  },
  {
    id: 'clash-general-sans',
    name: 'Clash Display + General Sans',
    category: 'typography',
    description: 'High-contrast industrial display face paired with bulletproof corporate grotesque.',
    tags: ['clash-display', 'general-sans', 'industrial', 'impact'],
    badge: 'High-Impact',
  },
  {
    id: 'jakarta-jetbrains',
    name: 'Plus Jakarta Sans + JetBrains Mono',
    category: 'typography',
    description:
      'Contemporary enterprise developer aesthetic. Friendly modern humanist sans paired with precision code font.',
    tags: ['jakarta-sans', 'jetbrains-mono', 'developer', 'enterprise'],
    badge: 'Developer SaaS',
  },
  {
    id: 'space-grotesk-inter',
    name: 'Space Grotesk + Inter',
    category: 'typography',
    description:
      'Clean developer-first typography. Technical grotesque titles with the world most legible UI body font.',
    tags: ['space-grotesk', 'inter', 'clean', 'developer'],
  },
  {
    id: 'playfair-source-sans',
    name: 'Playfair Display + Source Sans 3',
    category: 'typography',
    description: 'High-end luxury editorial magazine pairing. Sophisticated serif titles with neutral clean text.',
    tags: ['playfair-display', 'source-sans', 'luxury', 'editorial'],
  },
  {
    id: 'unbounded-dm-sans',
    name: 'Unbounded + DM Sans',
    category: 'typography',
    description:
      'Panoramic ultra-wide headlines with modern geometric body. Ideal for Web3, AI, and autonomous protocols.',
    tags: ['unbounded', 'dm-sans', 'web3', 'wide', 'futuristic'],
    badge: 'Web3 & AI',
  },
  {
    id: 'archivo-black-work-sans',
    name: 'Archivo Black + Work Sans',
    category: 'typography',
    description: 'Heavy brutalist poster typography. Uncompromising, high-energy, and direct.',
    tags: ['archivo-black', 'work-sans', 'brutalist', 'heavy'],
  },
  {
    id: 'fraunces-inter',
    name: 'Fraunces + Inter',
    category: 'typography',
    description: 'Warm vintage modernism. Quirky optical serif headlines grounded by utilitarian interface text.',
    tags: ['fraunces', 'inter', 'warm', 'retro-modern'],
  },
  {
    id: 'cinzel-cormorant',
    name: 'Cinzel + Cormorant Garamond',
    category: 'typography',
    description: 'Classical imperial elegance. Roman-inspired stone-carved titles with literary book serif body.',
    tags: ['cinzel', 'cormorant', 'classical', 'roman', 'imperial'],
  },
  {
    id: 'sora-jakarta',
    name: 'Sora + Plus Jakarta Sans',
    category: 'typography',
    description: 'Futuristic consumer fintech styling. Crisp futuristic curves with friendly consumer readability.',
    tags: ['sora', 'jakarta', 'fintech', 'consumer'],
  },
  {
    id: 'outfit-dm-sans',
    name: 'Outfit + DM Sans',
    category: 'typography',
    description: 'Clean Scandinavian minimalism. Balanced geometric geometry for clean minimalist SaaS portals.',
    tags: ['outfit', 'dm-sans', 'minimalist', 'scandinavian'],
  },
  {
    id: 'mona-hubot',
    name: 'Mona Sans + Hubot Sans',
    category: 'typography',
    description:
      'GitHub variable font archetype. Industrial grotesque engineered for high-density code and dashboards.',
    tags: ['github', 'mona-sans', 'hubot-sans', 'engineering'],
  },
  {
    id: 'instrument-serif-sans',
    name: 'Instrument Serif + Instrument Sans',
    category: 'typography',
    description:
      'Swiss modernist design studio identity. Elegant high-contrast serif headlines with functional grotesque.',
    tags: ['instrument-serif', 'instrument-sans', 'swiss', 'studio'],
  },
  {
    id: 'newsreader-general',
    name: 'Newsreader + General Sans',
    category: 'typography',
    description: 'Digital journalism and longform publication pairing. Refined book serif with neutral modern sans.',
    tags: ['newsreader', 'general-sans', 'journalism', 'longform'],
  },
  {
    id: 'big-shoulders-barlow',
    name: 'Big Shoulders Display + Barlow',
    category: 'typography',
    description:
      'Heavy condensed industrial styling. Tall bold condensed typography with utilitarian low-contrast body.',
    tags: ['condensed', 'industrial', 'heavy', 'chicago'],
  },
  {
    id: 'dela-gothic-noto',
    name: 'Dela Gothic One + Noto Sans',
    category: 'typography',
    description: 'Bold Japanese neo-retro poster typography. Heavy flat-top gothic display with universal legibility.',
    tags: ['dela-gothic', 'japanese-style', 'poster', 'neo-retro'],
  },
  {
    id: 'orbitron-rajdhani',
    name: 'Orbitron + Rajdhani',
    category: 'typography',
    description: 'Sci-fi cyberpunk HUD telemetry pairing. Geometric sci-fi display with condensed modular body.',
    tags: ['orbitron', 'rajdhani', 'sci-fi', 'cyberpunk', 'hud'],
  },
  {
    id: 'righteous-roboto',
    name: 'Righteous + Roboto',
    category: 'typography',
    description: 'Retro 80s arcade neon typography. Rounded futuristic titles with clean structural body.',
    tags: ['righteous', '80s', 'arcade', 'retro'],
  },
  {
    id: 'bungee-space-mono',
    name: 'Bungee + Space Mono',
    category: 'typography',
    description: 'Urban sign and neo-brutalist pairing. Blocky urban signage titles with typewriter monospaced body.',
    tags: ['bungee', 'space-mono', 'urban', 'signage'],
  },
  {
    id: 'poppins-open-sans',
    name: 'Poppins + Open Sans',
    category: 'typography',
    description:
      'Friendly, welcoming consumer product pairing. Geometric rounded headers with open, friendly body text.',
    tags: ['poppins', 'open-sans', 'consumer', 'friendly'],
  },
  {
    id: 'montserrat-merriweather',
    name: 'Montserrat + Merriweather',
    category: 'typography',
    description:
      'Classic agency combination. Geometric architectural headings with highly readable editorial serif text.',
    tags: ['montserrat', 'merriweather', 'agency', 'balanced'],
  },
  {
    id: 'raleway-lato',
    name: 'Raleway + Lato',
    category: 'typography',
    description:
      'Elegant boutique studio pairing. Distinctive thin-to-bold display with warm corporate grotesque body.',
    tags: ['raleway', 'lato', 'boutique', 'agency'],
  },
  {
    id: 'oswald-roboto-condensed',
    name: 'Oswald + Roboto Condensed',
    category: 'typography',
    description:
      'High-energy athletic and sports typography. Tight condensed impact headlines with structured dense body.',
    tags: ['oswald', 'condensed', 'athletic', 'high-impact'],
  },
  {
    id: 'bebas-neue-montserrat',
    name: 'Bebas Neue + Montserrat',
    category: 'typography',
    description:
      'Cinematic blockbuster film poster pairing. All-caps condensed titles with spacious modern geometric body.',
    tags: ['bebas-neue', 'montserrat', 'cinematic', 'poster'],
  },
  {
    id: 'barlow-fira-code',
    name: 'Barlow Condensed + Fira Code',
    category: 'typography',
    description:
      'Technical cockpit instrument pairing. Condensed aerospace labels with ligature-rich coding monospace.',
    tags: ['barlow', 'fira-code', 'aerospace', 'cockpit'],
  },
  {
    id: 'dm-serif-dm-sans',
    name: 'DM Serif Display + DM Sans',
    category: 'typography',
    description: 'Refined modern publisher pairing. Sculpted serif titles with harmonizing geometric grotesque body.',
    tags: ['dm-serif', 'dm-sans', 'publisher', 'sculpted'],
  },
  {
    id: 'bodoni-montserrat',
    name: 'Bodoni Moda + Montserrat',
    category: 'typography',
    description:
      'Haute couture luxury fashion aesthetic. Dramatic Didone vertical contrast with modern geometric body.',
    tags: ['bodoni', 'montserrat', 'haute-couture', 'luxury'],
  },
  {
    id: 'libre-baskerville-source',
    name: 'Libre Baskerville + Source Sans',
    category: 'typography',
    description:
      'Academic publishing and literary standard. Historic British book serif with crisp digital humanist sans.',
    tags: ['baskerville', 'source-sans', 'academic', 'literary'],
  },
  {
    id: 'marcellus-josefin',
    name: 'Marcellus + Josefin Sans',
    category: 'typography',
    description: 'Ancient minimalist luxury. Flared classical Roman proportions with vintage geometric geometry.',
    tags: ['marcellus', 'josefin-sans', 'ancient', 'minimalist'],
  },
  {
    id: 'spectral-nunito',
    name: 'Spectral + Nunito Sans',
    category: 'typography',
    description: 'Thoughtful essays and reading applications. Elegant digital-first serif with balanced soft sans.',
    tags: ['spectral', 'nunito', 'reading', 'essays'],
  },
  {
    id: 'urbanist-public-sans',
    name: 'Urbanist + Public Sans',
    category: 'typography',
    description:
      'Urban architecture and civic tech pairing. Low-contrast geometric headers with government-grade legibility.',
    tags: ['urbanist', 'public-sans', 'civic', 'architecture'],
  },
  {
    id: 'epilogue-manrope',
    name: 'Epilogue + Manrope',
    category: 'typography',
    description:
      'Contemporary tech agency aesthetic. Expressive proportional headings with semi-condensed modern body.',
    tags: ['epilogue', 'manrope', 'agency', 'tech'],
  },
  {
    id: 'syne-jetbrains',
    name: 'Syne + JetBrains Mono',
    category: 'typography',
    description: 'Tech-art hacker elite pairing. Avant-garde sculptural headlines with razor-sharp code telemetry.',
    tags: ['syne', 'jetbrains-mono', 'hacker', 'avant-garde'],
    badge: 'Hacker Elite',
  },
  {
    id: 'clash-fira-code',
    name: 'Clash Display + Fira Code',
    category: 'typography',
    description:
      'High-frequency algorithmic trading terminal typography. Bold industrial headers with programmer monospace.',
    tags: ['clash-display', 'fira-code', 'trading', 'crypto'],
  },
  {
    id: 'space-grotesk-jakarta',
    name: 'Space Grotesk + Plus Jakarta Sans',
    category: 'typography',
    description: 'Sovereign SaaS default pairing. Technical modern character with warm, highly converting body text.',
    tags: ['space-grotesk', 'jakarta', 'sovereign-saas', 'converting'],
  },
  {
    id: 'cabinet-jetbrains',
    name: 'Cabinet Grotesk + JetBrains Mono',
    category: 'typography',
    description: 'Zoth Studio high-contrast pairing. Continental European design style with terminal precision.',
    tags: ['cabinet-grotesk', 'jetbrains-mono', 'zoth-signature'],
  },
  {
    id: 'lexend-quicksand',
    name: 'Lexend + Quicksand',
    category: 'typography',
    description:
      'Maximum reading fluency and educational clarity. Scientifically designed reading font with friendly rounded text.',
    tags: ['lexend', 'quicksand', 'education', 'fluency'],
  },
  {
    id: 'outfit-space-mono',
    name: 'Outfit + Space Mono',
    category: 'typography',
    description: 'Next-generation AI platform aesthetic. Clean modern curves paired with mathematical monospace.',
    tags: ['outfit', 'space-mono', 'ai-platform', 'futuristic'],
  },
  {
    id: 'tanker-general',
    name: 'Tanker + General Sans',
    category: 'typography',
    description: 'Punchy athletic brand pairing. Chunky bold athletic display with dependable neutral body.',
    tags: ['tanker', 'general-sans', 'punchy', 'athletic'],
  },
];

/*
 * ==========================================================================
 * 6. Color Harmonies & Signature Themes (40+ items)
 * ==========================================================================
 */
export const COLOR_PALETTES: CatalogItem[] = [
  {
    id: 'imperial-gold-obsidian',
    name: 'Imperial Gold & Obsidian',
    category: 'palette',
    description:
      'ZothOS Signature aesthetic: Deep Obsidian (#08080B), Imperial Gold (#D4AF37), and Light Champagne (#F5E6AB).',
    tags: ['gold', 'obsidian', 'zoth-signature', 'luxury'],
    badge: 'Zoth Signature',
  },
  {
    id: 'cyber-emerald-solana',
    name: 'Cyber Emerald Solana',
    category: 'palette',
    description: 'Electric Solana Green (#14F195), Cyber Cyan (#00F0FF), and Midnight Black (#090A0F).',
    tags: ['emerald', 'solana', 'crypto', 'electric'],
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night Cyberpunk',
    category: 'palette',
    description: 'Deep indigo night (#1A1B26), neon blue (#7AA2F7), and vibrant magenta (#F7768E).',
    tags: ['tokyo-night', 'cyberpunk', 'neon', 'popular'],
  },
  {
    id: 'nord-frost',
    name: 'Nord Frost Arctic',
    category: 'palette',
    description: 'Arctic blue hues (#88C0D0, #81A1C1) on dark polar night slate (#2E3440).',
    tags: ['nord', 'arctic', 'slate', 'clean'],
  },
  {
    id: 'dracula-pro',
    name: 'Dracula Pro Vampiric',
    category: 'palette',
    description: 'Gothic dark slate (#282A36), vibrant purple (#BD93F9), and toxic emerald (#50FA7B).',
    tags: ['dracula', 'purple', 'high-contrast'],
  },
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    category: 'palette',
    description: 'Soothing pastel lavender (#CBA6F7), sapphire (#89B4FA), and warm crust (#1E1E2E).',
    tags: ['catppuccin', 'mocha', 'pastel', 'aesthetic'],
  },
  {
    id: 'synthwave-84',
    name: "Synthwave '84",
    category: 'palette',
    description: 'Neon retro sunset: electric fuchsia (#FF7EDB), cyan (#36F9F6), and dark grid purple (#262335).',
    tags: ['synthwave', 'retrowave', '80s', 'neon'],
  },
  {
    id: 'acid-lime-onyx',
    name: 'Acid Lime & Onyx',
    category: 'palette',
    description: 'High-visibility industrial neon lime (#CCFF00) on pitch carbon onyx (#111111).',
    tags: ['acid-lime', 'industrial', 'high-visibility', 'brutalist'],
  },
  {
    id: 'cyberpunk-2077',
    name: 'Cyberpunk 2077 Yellow',
    category: 'palette',
    description: 'Iconic high-voltage yellow (#FCEE0A), deep black (#000000), and cyan laser (#00F0FF).',
    tags: ['cyberpunk', 'yellow', 'high-voltage', 'futuristic'],
  },
  {
    id: 'monokai-pro',
    name: 'Monokai Pro Spectrum',
    category: 'palette',
    description: 'Dark warm grey (#2D2A2E) with balanced rainbow accents in coral, amber, lime, and cyan.',
    tags: ['monokai', 'spectrum', 'developer', 'vibrant'],
  },
  {
    id: 'gruvbox-dark',
    name: 'Gruvbox Dark Hard',
    category: 'palette',
    description:
      'Retro groove aesthetic with warm dark background (#1D2021), golden yellow (#FABD2F), and burnt orange (#FE8019).',
    tags: ['gruvbox', 'retro-groove', 'warm', 'earthy'],
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark Precision',
    category: 'palette',
    description: 'Scientifically calibrated cyan base (#002B36) with solarized blue (#268BD2) and yellow (#B58900).',
    tags: ['solarized', 'scientific', 'blue-base'],
  },
  {
    id: 'one-dark-pro',
    name: 'One Dark Pro (Atom)',
    category: 'palette',
    description:
      'Classic developer dark scheme: deep graphite (#282C34), electric sky (#61AFEF), and soft green (#98C379).',
    tags: ['one-dark', 'atom', 'graphite', 'classic'],
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark Dimmed',
    category: 'palette',
    description:
      'Polished developer workbench slate (#22272E) with GitHub blue (#58A6FF) and success emerald (#3FB950).',
    tags: ['github', 'slate', 'enterprise'],
  },
  {
    id: 'rose-pine-moon',
    name: 'Rosé Pine Moon',
    category: 'palette',
    description: 'Cozy dark slate (#232136), soft blush rose (#EBBCBA), and muted iris lavender (#C4A7E7).',
    tags: ['rose-pine', 'cozy', 'blush', 'aesthetic'],
  },
  {
    id: 'kanagawa-wave',
    name: 'Kanagawa Wave',
    category: 'palette',
    description:
      'Traditional Japanese woodblock color scheme: dark sumi ink (#1F1F28), samurai blue (#7E9CD8), and autumn red (#E46876).',
    tags: ['kanagawa', 'japanese', 'sumi-ink', 'traditional'],
  },
  {
    id: 'horizon-dark',
    name: 'Horizon Dark Glow',
    category: 'palette',
    description: 'Warm space dusk: dark purple navy (#1C1E26), neon coral (#E95678), and sunset gold (#FAB795).',
    tags: ['horizon', 'sunset', 'space-dusk'],
  },
  {
    id: 'cyber-blue-carbon',
    name: 'Cyber Blue & Carbon',
    category: 'palette',
    description: 'Ultra-clean fintech blue (#00E5FF, #2563EB) against stealth carbon pitch (#0A0F1D).',
    tags: ['fintech', 'blue', 'carbon', 'clean'],
  },
  {
    id: 'deep-space-nebula',
    name: 'Deep Space Nebula',
    category: 'palette',
    description: 'Cosmic purple glow (#BD34FE, #7928CA) set into deepest intergalactic black (#0B0B14).',
    tags: ['nebula', 'cosmic', 'purple', 'glow'],
  },
  {
    id: 'sunset-horizon',
    name: 'Sunset Horizon Orange',
    category: 'palette',
    description: 'Vibrant sunset gradient (#FF5E3A, #FF2A54) against warm charcoal twilight (#151520).',
    tags: ['sunset', 'orange', 'warm', 'vibrant'],
  },
  {
    id: 'midnight-sapphire',
    name: 'Midnight Sapphire',
    category: 'palette',
    description: 'Deepest oceanic sapphire (#3B82F6, #1D4ED8) on midnight abyssal ground (#050B18).',
    tags: ['sapphire', 'ocean', 'deep-blue'],
  },
  {
    id: 'crimson-obsidian',
    name: 'Crimson & Obsidian',
    category: 'palette',
    description: 'Dramatic blood crimson (#EF4444, #DC2626) against sharp pitch obsidian (#0D0507).',
    tags: ['crimson', 'red', 'dramatic', 'high-contrast'],
  },
  {
    id: 'hyper-neon-purple',
    name: 'Hyper Neon Ultraviolet',
    category: 'palette',
    description: 'Electric ultraviolet glow (#A855F7, #C084FC) against pitch dark void (#0A0512).',
    tags: ['ultraviolet', 'neon-purple', 'electric'],
  },
  {
    id: 'matrix-terminal-phosphor',
    name: 'Matrix Terminal Phosphor',
    category: 'palette',
    description: 'Authentic phosphor green CRT glow (#22C55E, #4ADE80) on deep black vacuum (#020D04).',
    tags: ['matrix', 'phosphor', 'terminal', 'green'],
  },
  {
    id: 'warm-terracotta',
    name: 'Warm Terracotta & Sand',
    category: 'palette',
    description: 'Organic clay terracotta (#E07A5F) with warm desert dune sand on dark coffee obsidian (#181412).',
    tags: ['terracotta', 'clay', 'organic', 'warm'],
  },
  {
    id: 'royal-amethyst-gold',
    name: 'Royal Amethyst & Gold',
    category: 'palette',
    description:
      'Imperial royal purple (#9333EA) paired with gleaming metallic gold (#F59E0B) on velvet void (#0F081C).',
    tags: ['amethyst', 'royal', 'gold', 'regal'],
  },
  {
    id: 'stealth-matte-charcoal',
    name: 'Stealth Matte Charcoal',
    category: 'palette',
    description: 'Minimalist industrial stealth: muted zinc (#71717A) on matte carbon graphite (#18181B).',
    tags: ['stealth', 'matte', 'monochrome', 'industrial'],
  },
  {
    id: 'swiss-monochrome',
    name: 'Swiss Pure Monochrome',
    category: 'palette',
    description: 'Pure stark Swiss typographic contrast: absolute white (#FFFFFF) on absolute black (#000000).',
    tags: ['swiss', 'monochrome', 'stark', 'black-and-white'],
  },
  {
    id: 'akihabara-neon',
    name: 'Akihabara Neon Pink',
    category: 'palette',
    description: 'Tokyo electric arcade pink (#FF007F) and laser cyan (#00F0FF) on deep midnight violet (#0A0A14).',
    tags: ['tokyo', 'arcade', 'neon-pink', 'akihabara'],
  },
  {
    id: 'vaporwave-horizon',
    name: 'Vaporwave Horizon',
    category: 'palette',
    description: 'Pastel cyan (#00F0FF) and candy magenta (#F43F5E) across a retro palm twilight purple (#1B0F2A).',
    tags: ['vaporwave', 'pastel', 'cyan-pink', 'retro'],
  },
  {
    id: 'copper-bronze-slate',
    name: 'Copper Bronze & Slate',
    category: 'palette',
    description: 'Warm metallic copper (#D97706, #B45309) on architectural blue slate (#1E293B).',
    tags: ['copper', 'bronze', 'slate', 'warm-metallic'],
  },
  {
    id: 'sage-mint-forest',
    name: 'Sage Mint & Forest',
    category: 'palette',
    description: 'Calming botanical mint (#34D399) on deep dark evergreen forest slate (#064E3B).',
    tags: ['sage', 'mint', 'botanical', 'forest'],
  },
  {
    id: 'cyber-orange-tangerine',
    name: 'Cyber Orange Tangerine',
    category: 'palette',
    description: 'High-visibility safety tangerine (#FF7700) on dark aerospace composite (#100C08).',
    tags: ['tangerine', 'orange', 'aerospace', 'high-visibility'],
  },
  {
    id: 'terminal-amber',
    name: 'Terminal Amber Classic',
    category: 'palette',
    description: 'Vintage VT220 amber phosphor monitor glow (#F59E0B) on pitch black background (#0B0B0B).',
    tags: ['amber', 'vintage', 'vt220', 'terminal'],
  },
  {
    id: 'frostbite-glacier',
    name: 'Frostbite Glacier Cyan',
    category: 'palette',
    description: 'Glacial ice cyan (#38BDF8) and frosty teal (#2DD4BF) on arctic deep sea slate (#0C1A2E).',
    tags: ['glacier', 'frostbite', 'cyan', 'arctic'],
  },
  {
    id: 'velvet-wine-champagne',
    name: 'Velvet Wine & Champagne',
    category: 'palette',
    description: 'Rich burgundy wine (#E11D48) with sparkling champagne gold accents on dark noir velvet (#1A0910).',
    tags: ['wine', 'burgundy', 'champagne', 'noir'],
  },
  {
    id: 'electric-ultraviolet',
    name: 'Electric Ultraviolet Blue',
    category: 'palette',
    description: 'Intense indigo ultraviolet (#6366F1, #818CF8) on deep starry cosmos navy (#0B0E23).',
    tags: ['ultraviolet', 'indigo', 'electric-blue'],
  },
  {
    id: 'titanium-alloy',
    name: 'Titanium Aerospace Alloy',
    category: 'palette',
    description: 'Precision brushed titanium (#94A3B8, #CBD5E1) on aerospace defense slate (#0F172A).',
    tags: ['titanium', 'aerospace', 'alloy', 'clean-slate'],
  },
  {
    id: 'desert-dune-gold',
    name: 'Desert Dune Gold',
    category: 'palette',
    description: 'Golden sun-drenched dune sand (#EAB308) on warm sandstone basalt (#1C1917).',
    tags: ['desert', 'dune', 'gold', 'sandstone'],
  },
  {
    id: 'deep-ocean-abyssal',
    name: 'Deep Ocean Abyssal',
    category: 'palette',
    description: 'Bioluminescent deep-sea cyan (#0284C7, #06B6D4) on pitch ocean trench black (#031326).',
    tags: ['ocean', 'abyssal', 'bioluminescent'],
  },
];

/* Helper to get all catalog items */
export const ALL_DESIGN_COMMODITIES: CatalogItem[] = [
  ...FRAMEWORK_OPTIONS,
  ...UI_LIBRARIES,
  ...ANIMATION_LIBRARIES,
  ...COMMODITIES_AND_EFFECTS,
  ...TYPOGRAPHY_PAIRINGS,
  ...COLOR_PALETTES,
];
