/**
 * Error Logging Service
 * Logs to console in dev, can be extended for production services like Sentry
 */

type ErrorLevel = 'error' | 'warn' | 'info'

interface LogEntry {
  level: ErrorLevel
  message: string
  error?: unknown
  context?: Record<string, unknown>
  timestamp: string
}

class ErrorLogger {
  private isDev: boolean

  constructor() {
    this.isDev = process.env.NODE_ENV === 'development'
  }

  private formatEntry(level: ErrorLevel, message: string, error?: unknown, context?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
      context,
      timestamp: new Date().toISOString()
    }
  }

  private log(entry: LogEntry): void {
    const output = JSON.stringify(entry)

    // Always log to console
    if (entry.level === 'error') {
      console.error(output)
    } else if (entry.level === 'warn') {
      console.warn(output)
    } else {
      console.log(output)
    }

    // TODO: Send to external service in production
    // if (!this.isDev && entry.level === 'error') {
    //   this.sendToSentry(entry)
    // }
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    this.log(this.formatEntry('error', message, error, context))
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(this.formatEntry('warn', message, undefined, context))
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(this.formatEntry('info', message, undefined, context))
  }
}

export const errorLogger = new ErrorLogger()
