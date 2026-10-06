# Frequently Asked Questions (FAQ)

<details>
<summary><strong>What are the recommended models for Zoth WebGen?</strong></summary>

For optimal speed, accuracy, and token economy with Zoth WebGen:

- **Gemini 2.5 Flash** (Default): Exceptional speed, massive 1M token context window, highly accurate code generation, and low latency.
- **Claude 3.5 Sonnet**: Powerful complex architectural reasoning and nuanced UI component design.
- **GPT-4o**: High-capability generalist coding model.
- **DeepSeek V3 / R1**: Cost-effective open-weights reasoning and generation.
- **Qwen 2.5 Coder 32b**: Excellent local model for self-hosted Ollama / LM Studio setups.

</details>

<details>
<summary><strong>How do I achieve the highest quality web generation?</strong></summary>

- **Specify Design & Architecture Tokens**:  
  Detail your preferred design requirements (e.g., dark-glassmorphic, Bento grid layout, Imperial Gold accents, Tailwind CSS, Vite) in your initial prompt.

- **Use the Enhance Prompt Action**:  
  Click the ✨ *Enhance* button next to the input to expand and enrich your prompt with full-stack requirements before generating.

- **Iterative Refinement**:  
  Scaffold the layout and schema first, then add authentication, data models, and interactive features step by step.

- **Batch Instructions**:  
  Group related style and functional changes into a cohesive instruction to optimize model generation cycles.

</details>

<details>
<summary><strong>Where does my code execute?</strong></summary>

All code is compiled and executed **100% inside your local browser** via WebContainer (WebAssembly-based virtual Node.js micro-kernel). No source code or secrets are sent to external third-party servers.

</details>
