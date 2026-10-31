#!/usr/bin/env python3
"""
Zoth Bolt (bolt.diy) - Sovereign Local Server & REST API
Port: 5173
Engineered by Neal Frazier Tech (@1nc0gn30) • NullAI Platform
"""

import sys
import os
import json
import time
import argparse
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse

START_TIME = time.time()
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public')

PROVIDERS = [
    {"id": "anthropic", "name": "Anthropic (Claude 3.5 Sonnet / Haiku)", "status": "active"},
    {"id": "openai", "name": "OpenAI (GPT-4o / o1)", "status": "active"},
    {"id": "google", "name": "Google Gemini 2.0 / 1.5 Pro", "status": "active"},
    {"id": "groq", "name": "Groq LPU (Llama 3.3 70B)", "status": "active"},
    {"id": "ollama", "name": "Local Ollama (DeepSeek R1 / Qwen 2.5)", "status": "active"},
    {"id": "lmstudio", "name": "LM Studio Local Enclave", "status": "active"},
    {"id": "mistral", "name": "Mistral Large / Codestral", "status": "active"},
    {"id": "deepseek", "name": "DeepSeek API", "status": "active"},
    {"id": "xai", "name": "xAI Grok", "status": "active"},
    {"id": "together", "name": "Together AI", "status": "active"},
    {"id": "openrouter", "name": "OpenRouter Multi-Model", "status": "active"}
]

TEMPLATES = [
    {"id": "react-vite", "name": "React + Vite + Tailwind CSS", "framework": "react"},
    {"id": "nextjs", "name": "Next.js App Router + TypeScript", "framework": "nextjs"},
    {"id": "vue", "name": "Vue 3 + Vite + UnoCSS", "framework": "vue"},
    {"id": "svelte", "name": "SvelteKit High-Performance", "framework": "svelte"},
    {"id": "motion-graphics", "name": "Remotion / Claude Motion 60fps", "framework": "motion"},
    {"id": "vanilla-avant-garde", "name": "Vanilla JS Avant-Garde Pure Shaders", "framework": "vanilla"}
]

class ZothBoltHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path in ('/health', '/api/health'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            payload = {
                "status": "healthy",
                "service": "bolt.diy",
                "tool": "Zoth Bolt",
                "port": 5173,
                "uptime_seconds": round(time.time() - START_TIME, 2),
                "version": "3.5.0",
                "providers_count": len(PROVIDERS),
                "templates_count": len(TEMPLATES),
                "license": "100% Free & Open Access",
                "support": {
                    "stripe_coffee": "https://buy.stripe.com/3cIfZg27PdKo2D64Ocfw40X",
                    "solana_tip": "GG2eQbVh8ut1BK6j1A2tz7pSySdLpD38BgyEhGcxdXoK"
                }
            }
            self.wfile.write(json.dumps(payload, indent=2).encode('utf-8'))
            return

        if path == '/api/providers':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"providers": PROVIDERS}, indent=2).encode('utf-8'))
            return

        if path == '/api/templates':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"templates": TEMPLATES}, indent=2).encode('utf-8'))
            return

        return super().do_GET()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    parser = argparse.ArgumentParser(description="Zoth Bolt Local Server")
    parser.add_argument('--port', type=int, default=5173, help='Port to bind (default: 5173)')
    parser.add_argument('--host', type=str, default='127.0.0.1', help='Host to bind (default: 127.0.0.1)')
    args = parser.parse_args()

    server_address = (args.host, args.port)
    httpd = HTTPServer(server_address, ZothBoltHandler)
    print(f"✦ Zoth Bolt running at http://{args.host}:{args.port}")
    print(f"✦ Endpoints: /health, /api/providers, /api/templates")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Zoth Bolt server.")
        httpd.server_close()

if __name__ == '__main__':
    main()
