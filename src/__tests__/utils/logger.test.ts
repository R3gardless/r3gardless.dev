import { afterEach, describe, expect, it, vi } from 'vitest';

import { logError, logWarn } from '@/utils/logger';

describe('logger', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('keeps the original detail object outside production for debugging', () => {
    const error = new Error('Detailed failure');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    logError('Content load failed', error);

    expect(consoleSpy).toHaveBeenCalledWith('[Content load failed]', error);
  });

  it('hides detail in production logs', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    logWarn('Content path is unavailable', 'Private local path detail');

    expect(consoleSpy).toHaveBeenCalledWith('[Content path is unavailable]');
    expect(consoleSpy).not.toHaveBeenCalledWith(
      '[Content path is unavailable]',
      'Private local path detail',
    );
  });
});
