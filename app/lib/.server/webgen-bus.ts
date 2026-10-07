type SSEController = {
  id: string;
  send: (data: string) => void;
  close: () => void;
};

interface WebGenGlobalState {
  isStreaming: boolean;
  activeChatId: string | null;
  previewUrl: string | null;
  files: Record<string, { type: 'file'; content: string; isLocked?: boolean }>;
  lastPrompt: string;
  lastUpdated: number;
}

class WebGenBridge {
  private static _instance: WebGenBridge;
  private _clients: Map<string, SSEController> = new Map();
  private _state: WebGenGlobalState = {
    isStreaming: false,
    activeChatId: null,
    previewUrl: null,
    files: {},
    lastPrompt: '',
    lastUpdated: Date.now(),
  };

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): WebGenBridge {
    if (!WebGenBridge._instance) {
      WebGenBridge._instance = new WebGenBridge();
    }

    return WebGenBridge._instance;
  }

  addClient(id: string, controller: SSEController) {
    this._clients.set(id, controller);

    // Send initial state sync event
    controller.send(
      JSON.stringify({
        type: 'CONNECTED',
        state: this.getState(),
      }),
    );
  }

  removeClient(id: string) {
    this._clients.delete(id);
  }

  broadcast(event: { type: string; [key: string]: any }) {
    const payload = `data: ${JSON.stringify(event)}\n\n`;

    for (const [id, client] of this._clients.entries()) {
      try {
        client.send(payload);
      } catch {
        this._clients.delete(id);
      }
    }
  }

  updateState(partial: Partial<WebGenGlobalState>) {
    this._state = {
      ...this._state,
      ...partial,
      lastUpdated: Date.now(),
    };
  }

  getState(): WebGenGlobalState {
    return this._state;
  }

  getClientCount(): number {
    return this._clients.size;
  }
}

export const webGenBridge = WebGenBridge.getInstance();
