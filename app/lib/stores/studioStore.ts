import { atom } from 'nanostores';

export interface StudioTelemetry {
  tokensPerSec?: number;
  totalTokens?: number;
  latencyMs?: number;
  status: 'idle' | 'streaming' | 'complete' | 'error';
}

export const isAIStudioOpenAtom = atom<boolean>(false);
export const studioTelemetryAtom = atom<StudioTelemetry>({
  tokensPerSec: 0,
  totalTokens: 0,
  latencyMs: 0,
  status: 'idle',
});
