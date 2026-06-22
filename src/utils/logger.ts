type LogLevel = 'error' | 'warn';

function formatLogDetail(detail: unknown): string {
  if (!detail) {
    return '';
  }

  if (detail instanceof Error) {
    return detail.message;
  }

  if (typeof detail === 'string') {
    return detail;
  }

  return 'Unknown error';
}

function writeLog(level: LogLevel, context: string, detail?: unknown) {
  const message = formatLogDetail(detail);
  const suffix = process.env.NODE_ENV !== 'production' && message ? `: ${message}` : '';

  console[level](`[${context}]${suffix}`);
}

export function logError(context: string, detail?: unknown) {
  writeLog('error', context, detail);
}

export function logWarn(context: string, detail?: unknown) {
  writeLog('warn', context, detail);
}
