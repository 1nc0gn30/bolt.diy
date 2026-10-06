# 👑 Zoth WebGen Foundry

> **Where Sovereign Software Begins.**  
> Autonomous In-Browser Full-Stack Application Architect & Real-Time WebContainer Engine.

---

## ⚡ Overview

**Zoth WebGen Foundry** is an autonomous AI-driven web development environment that runs 100% inside your browser. Powered by Node.js WebContainer technology, Zoth WebGen enables you to prompt, architect, build, compile, and run full-stack applications with real-time preview, live code editing, and integrated deployment rails.

- **Engineered by**: Neal Frazier Tech ([@1nc0gn30](https://github.com/1nc0gn30))
- **Platform**: [NullAI Platform](https://nullai.tech)
- **Attribution**: Inspired by Bolt

---

## 💎 Features & Capabilities

- **100% In-Browser Runtime**: Runs a sandboxed WebContainer environment executing Node.js, Vite, npm/pnpm, and AST transforms without relying on remote virtual machines.
- **Imperial Gold Design System**: Bespoke obsidian dark aesthetic with Imperial Gold (`#D4AF37`) accents, glassmorphic panels, and high-fashion typography (`Syne` / `Space Grotesk` + `JetBrains Mono`).
- **Pre-Configured Frontier LLM Support**:
  - **Google Gemini** (Default: `gemini-2.5-flash` with 1M token context window)
  - Anthropic Claude
  - OpenAI / GPT-4o
  - DeepSeek, Groq, xAI, Mistral, Ollama, OpenRouter, and custom OpenAI-compatible endpoints.
- **Live Interactive Workbench**: Integrated Monaco/CodeMirror code editor, real-time terminal shell, multi-file navigator, and live browser iframe preview.
- **One-Click Deployments**: Direct integration with Netlify and Vercel edge deployment rails.
- **Database & Auth Integration**: Native Supabase schema migrations, query executions, and connection management.
- **Git Import & Forking**: Clone and import public GitHub/GitLab repositories directly into the in-browser runtime.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js `v20.x` or later (tested on Node.js `v22` / `v26`)
- `pnpm` (recommended) or `npm`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/1nc0gn30/zoth-webgen.git
cd zoth-webgen

# Install dependencies
pnpm install
```

### 3. Environment Configuration
Create a `.env.local` file in the project root:
```env
# Default Provider: Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Optional: Add other provider keys as needed
# ANTHROPIC_API_KEY=...
# OPENAI_API_KEY=...
# GROQ_API_KEY=...
```

### 4. Run Development Server
```bash
pnpm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Architecture

```
zoth-webgen/
├── app/
│   ├── components/         # React UI Components (Header, Chat, Workbench, Settings)
│   ├── lib/
│   │   ├── modules/llm/    # Multi-provider LLM abstraction (Google, OpenAI, Anthropic)
│   │   ├── stores/         # Nanostores reactive state management
│   │   ├── persistence/    # IndexedDB chat snapshot and session persistence
│   │   └── webcontainer/   # Browser-native Node.js execution runtime
│   ├── routes/             # Remix route tree and API endpoints
│   └── styles/             # Imperial Gold tokens and UnoCSS configuration
├── engine/                 # Autonomous headless browser verification engines
└── public/                 # Favicons, emblems, and static assets
```

---

## 🔒 Privacy & Sovereignty

All prompts, workspace files, and execution state remain inside your browser's IndexedDB and local storage. No code is transmitted to external tracking or telemetry servers.

---

## 📜 License

MIT License • Engineered with excellence by **Neal Frazier Tech** & **NullAI Platform**. Inspired by Bolt.
