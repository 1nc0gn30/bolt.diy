import { describe, expect, it } from 'vitest';
import { isTrustedTerminalRequest } from '~/routes/api.agy.terminal';

const req = (headers: Record<string, string>) =>
  new Request('http://localhost:5173/api/agy/terminal', {
    method: 'POST',
    headers: { Host: 'localhost:5173', ...headers },
  });

describe('isTrustedTerminalRequest', () => {
  it('allows same-origin JSON', () => {
    expect(
      isTrustedTerminalRequest(req({ 'Content-Type': 'application/json', Origin: 'http://localhost:5173' })).ok,
    ).toBe(true);
  });
  it('blocks foreign origins', () => {
    expect(
      isTrustedTerminalRequest(req({ 'Content-Type': 'application/json', Origin: 'https://evil.example' })).ok,
    ).toBe(false);
  });
  it('blocks non-JSON simple requests', () => {
    expect(isTrustedTerminalRequest(req({ 'Content-Type': 'text/plain' })).ok).toBe(false);
  });
  it('blocks cross-site fetch metadata', () => {
    expect(
      isTrustedTerminalRequest(req({ 'Content-Type': 'application/json', 'Sec-Fetch-Site': 'cross-site' })).ok,
    ).toBe(false);
  });
});
