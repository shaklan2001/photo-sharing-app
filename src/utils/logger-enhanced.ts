/**
 * Enhanced logger with production logging options
 */

class EnhancedLogger {
  private isDev = __DEV__;
  private enableProductionLogs = false; // Set to true if you want production logs

  log(...args: any[]) {
    if (this.isDev || this.enableProductionLogs) {
      console.log(...args);
    }
  }

  error(...args: any[]) {
    // Always log errors, even in production (for debugging)
    console.error(...args);
  }

  warn(...args: any[]) {
    if (this.isDev || this.enableProductionLogs) {
      console.warn(...args);
    }
  }

  info(...args: any[]) {
    if (this.isDev || this.enableProductionLogs) {
      console.info(...args);
    }
  }

  // Force log something even in production
  forceLog(...args: any[]) {
    console.log(...args);
  }
}

export const enhancedLogger = new EnhancedLogger();
