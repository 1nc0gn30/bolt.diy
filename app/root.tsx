import { useStore } from '@nanostores/react';
import type { LinksFunction } from '@remix-run/cloudflare';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import tailwindReset from '@unocss/reset/tailwind-compat.css?url';
import xtermStyles from '@xterm/xterm/css/xterm.css?url';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cssTransition, ToastContainer } from 'react-toastify';

import reactToastifyStyles from 'react-toastify/dist/ReactToastify.css?url';
import { createHead } from 'remix-island';
import { ClientOnly } from 'remix-utils/client-only';

import 'virtual:uno.css';

const toastAnimation = cssTransition({
  enter: 'animated fadeInRight',
  exit: 'animated fadeOutRight',
});

export const links: LinksFunction = () => [
  {
    rel: 'icon',
    href: '/favicon.svg',
    type: 'image/svg+xml',
  },
  { rel: 'stylesheet', href: reactToastifyStyles },
  { rel: 'stylesheet', href: tailwindReset },
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'stylesheet', href: xtermStyles },
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700&family=Space+Grotesk:wght@500;600;700&family=Syne:wght@600;700;800&display=swap',
  },
];

const schemaJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Zoth WebGen Foundry',
      url: 'https://webgen.nullai.tech/',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'All',
      description:
        'Autonomous in-browser full-stack application architect and WebContainer runtime by Neal Frazier Tech.',
      offers: {
        '@type': 'Offer',
        price: '19.00',
        priceCurrency: 'USD',
        url: 'https://buy.stripe.com/cNiaEWaEldKo6Tm1C0fw40D',
      },
      creator: {
        '@type': 'Organization',
        name: 'Neal Frazier Tech',
        url: 'https://nealfrazier.tech',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Does Zoth WebGen send source code or prompts to central servers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. All AST transformations, Node.js packaging, and code executions take place 100% locally in your browser with complete privacy.',
          },
        },
        {
          '@type': 'Question',
          name: 'What payment options are accepted for Pro Lifetime Access?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We accept Credit Cards, Apple Pay, and Google Pay via Stripe ($19 lifetime), as well as Solana (SOL / USDC) via DePay Web3 widgets.',
          },
        },
      ],
    },
  ],
};

export const Head = createHead(() => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta property="og:title" content="Zoth WebGen — Autonomous App Foundry" />
    <meta
      property="og:description"
      content="Where Sovereign Software Begins: Autonomous full-stack application architect & WebContainer engine by Neal Frazier Tech."
    />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://webgen.nullai.tech/" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@1nc0gn30" />
    <meta name="twitter:creator" content="@1nc0gn30" />
    <Meta />
    <Links />
  </>
));

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useStore(themeStore);

  useEffect(() => {
    document.querySelector('html')?.setAttribute('data-theme', theme);

    // Cleanly inject Schema.org JSON-LD without React script tag warning
    const scriptId = 'zoth-schema-graph';

    if (typeof document !== 'undefined' && !document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schemaJsonLd);
      document.head.appendChild(script);
    }
  }, [theme]);

  return (
    <>
      <ClientOnly>{() => <DndProvider backend={HTML5Backend}>{children}</DndProvider>}</ClientOnly>
      <ToastContainer
        closeButton={({ closeToast }) => {
          return (
            <button className="Toastify__close-button" onClick={closeToast}>
              <div className="i-ph:x text-lg" />
            </button>
          );
        }}
        icon={({ type }) => {
          switch (type) {
            case 'success': {
              return <div className="i-ph:check-bold text-bolt-elements-icon-success text-2xl" />;
            }
            case 'error': {
              return <div className="i-ph:warning-circle-bold text-bolt-elements-icon-error text-2xl" />;
            }
          }

          return undefined;
        }}
        position="bottom-right"
        pauseOnFocusLoss
        transition={toastAnimation}
        autoClose={3000}
      />
      <ScrollRestoration />
      <Scripts />
    </>
  );
}

import { logStore } from './lib/stores/logs';
import { themeStore } from './lib/stores/theme';
import globalStyles from './styles/index.scss?url';

export default function App() {
  const theme = useStore(themeStore);

  useEffect(() => {
    logStore.logSystem('Application initialized', {
      theme,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });

    // Initialize debug logging with improved error handling
    import('./utils/debugLogger')
      .then(({ debugLogger }) => {
        /*
         * The debug logger initializes itself and starts disabled by default
         * It will only start capturing when enableDebugMode() is called
         */
        const status = debugLogger.getStatus();
        logStore.logSystem('Debug logging ready', {
          initialized: status.initialized,
          capturing: status.capturing,
          enabled: status.enabled,
        });
      })
      .catch((error) => {
        logStore.logError('Failed to initialize debug logging', error);
      });
  }, []);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
