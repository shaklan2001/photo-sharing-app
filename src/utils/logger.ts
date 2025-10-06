/**
 * Production-safe logger utility
 * Supports debugging in preview builds
 */

class Logger {
  private isDev = __DEV__;
  private enablePreviewLogs = true; // Enable for debugging preview builds

  log(...args: any[]) {
    if (this.isDev || this.enablePreviewLogs) {
      console.log('[LOG]', ...args);
    }
  }

  error(...args: any[]) {
    // Always log errors for debugging
    console.error('[ERROR]', ...args);
  }

  warn(...args: any[]) {
    if (this.isDev || this.enablePreviewLogs) {
      console.warn('[WARN]', ...args);
    }
  }

  info(...args: any[]) {
    if (this.isDev || this.enablePreviewLogs) {
      console.info('[INFO]', ...args);
    }
  }

  // Force log critical information
  debug(...args: any[]) {
    console.log('[DEBUG]', ...args);
  }
}

export const logger = new Logger();
