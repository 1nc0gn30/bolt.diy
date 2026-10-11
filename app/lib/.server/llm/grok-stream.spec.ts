import { describe, expect, it } from 'vitest';
import { createGrokParseState, finishGrokChunk, pushGrokChunk } from './grok-stream';

describe('grok stream parser', () => {
  it('keeps text deltas and ignores the repeated final result', () => {
    const state = createGrokParseState();

    let buffer = '';
    buffer = pushGrokChunk(
      state,
      buffer,
      '{"type":"stream_event","event":{"type":"content_block_delta","delta":{"type":"text_delta","text":"<bolt"}}}\n',
    );
    buffer = pushGrokChunk(
      state,
      buffer,
      '{"type":"content_block_delta","delta":{"type":"text_delta","text":"Artifact>"}}\n{"type":"result","result":"DO NOT REPEAT","stop_reason":"end_turn"}\n',
    );
    finishGrokChunk(state, buffer);

    expect(state.text).toBe('<boltArtifact>');
    expect(state.finishReason).toBe('stop');
  });

  it('marks a max token stop so the same model can continue', () => {
    const state = createGrokParseState();

    const buffer = pushGrokChunk(state, '', '{"type":"message_delta","delta":{"stop_reason":"max_tokens"}}\n');
    finishGrokChunk(state, buffer);

    expect(state.finishReason).toBe('length');
  });

  it('ignores thinking deltas and does not repeat the final assistant text', () => {
    const state = createGrokParseState();

    const raw = [
      '{"type":"stream_event","event":{"type":"content_block_delta","delta":{"type":"thinking_delta","thinking":"plan"}}}',
      '{"type":"stream_event","event":{"type":"content_block_delta","delta":{"type":"text_delta","text":"ready"}}}',
      '{"type":"assistant","message":{"content":[{"type":"text","text":"ready"}]}}',
      '{"type":"result","result":"ready","stop_reason":"end_turn"}',
    ].join('\n');
    finishGrokChunk(state, pushGrokChunk(state, '', `${raw}\n`));

    expect(state.text).toBe('ready');
    expect(state.finishReason).toBe('stop');
  });

  it('uses the result text when no deltas arrived', () => {
    const state = createGrokParseState();
    finishGrokChunk(state, '{"type":"result","result":"ready","stop_reason":"end_turn"}');

    expect(state.text).toBe('ready');
  });
});
