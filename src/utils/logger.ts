type LogLevel = 'error' | 'warn';

function writeLog(level: LogLevel, context: string, detail?: unknown) {
  const message = `[${context}]`;

  if (process.env.NODE_ENV === 'production' || typeof detail === 'undefined') {
    console[level](message);
    return;
  }

  console[level](message, detail);
}

export function logError(context: string, detail?: unknown) {
  writeLog('error', context, detail);
}

export function logWarn(context: string, detail?: unknown) {
  writeLog('warn', context, detail);
}
