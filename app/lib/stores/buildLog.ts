import { atom } from 'nanostores';

export type BuildLogKind = 'info' | 'file' | 'shell' | 'start' | 'continue' | 'error' | 'tokens' | 'tool' | 'progress';

export interface BuildLogLine {
  id: string;
  ts: number;
  kind: BuildLogKind;
  message: string;
  detail?: string;
}

const MAX_LINES = 400;

export const buildLogAtom = atom<BuildLogLine[]>([]);
export const buildLogOpenAtom = atom<boolean>(true);

export function pushBuildLog(kind: BuildLogKind, message: string, detail?: string) {
  const line: BuildLogLine = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    kind,
    message,
    detail,
  };
  const next = [...buildLogAtom.get(), line];
  buildLogAtom.set(next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next);
}

export function clearBuildLog() {
  buildLogAtom.set([]);
}
