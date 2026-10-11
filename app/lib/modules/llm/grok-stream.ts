export interface GrokParseState {
  text: string;
  finishReason: 'stop' | 'length';
  sawDelta: boolean;
}

export function createGrokParseState(): GrokParseState {
  return { text: '', finishReason: 'stop', sawDelta: false };
}

function noteStop(state: GrokParseState, stop: unknown) {
  if (stop === 'max_tokens') {
    state.finishReason = 'length';
  }
}

export function consumeGrokLine(state: GrokParseState, line: string) {
  const trimmed = line.trim();

  if (!trimmed.startsWith('{')) {
    return;
  }

  let obj: any;

  try {
    obj = JSON.parse(trimmed);
  } catch {
    return;
  }

  const event = obj?.type === 'stream_event' && obj.event ? obj.event : obj;
  const delta = event?.delta;

  if (event?.type === 'content_block_delta' && delta?.type === 'text_delta' && typeof delta.text === 'string') {
    state.text += delta.text;
    state.sawDelta = true;
  }

  noteStop(state, delta?.stop_reason ?? event?.stop_reason ?? obj?.stop_reason ?? obj?.message?.stop_reason);

  if (state.sawDelta) {
    return;
  }

  if (obj?.type === 'assistant' && Array.isArray(obj.message?.content)) {
    for (const block of obj.message.content) {
      if (block?.type === 'text' && typeof block.text === 'string') {
        state.text += block.text;
      }
    }
  }

  if (obj?.type === 'result' && typeof obj.result === 'string') {
    state.text = obj.result;
  }
}

export function pushGrokChunk(state: GrokParseState, buffer: string, chunk: string): string {
  const lines = (buffer + chunk).split('\n');
  const rest = lines.pop() ?? '';

  for (const line of lines) {
    consumeGrokLine(state, line);
  }

  return rest;
}

export function finishGrokChunk(state: GrokParseState, buffer: string) {
  if (buffer.trim()) {
    consumeGrokLine(state, buffer);
  }
}
