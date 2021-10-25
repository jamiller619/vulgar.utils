type PossibleLogMessageType = unknown | Record<string, unknown>
type LogMessageType = PossibleLogMessageType | PossibleLogMessageType[]

declare class Logger {
  info: (...params: LogMessageType[]) => Logger
  error: (...params: LogMessageType[]) => Logger
  group: (label?: string) => Logger
  groupEnd: () => Logger
  constructor(...params: LogMessageType[])
}

const isObject = (obj: unknown) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

const parseObject = <T = unknown>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

const logMessages = (
  logger = console.log,
  ...params: LogMessageType[]
): void => {
  const results = []

  for (const param of params) {
    if (param == null) {
      results.push(`Got a value of "null" or "undefined"`)
    } else if (Array.isArray(param)) {
      results.push(...param)
    } else if (isObject(param)) {
      try {
        console.dir(parseObject(param))
      } catch (e) {
        results.push(param)
      }
    } else {
      results.push(param)
    }
  }

  if (results.length > 0) {
    logger(...results)
  }
}

/**
 * Log anything, with properly formatted objects. Arrays are
 * treated as pass throughs, so if you don't want formatting
 * on an object, wrap it in an array.
 * Supports chaining.
 * @param params Anything you can pass to console.log
 */
function Logger(...params: LogMessageType[]) {
  logMessages(console.log, ...params)
}

/**
 * Information-level logging (same as `log`)
 */
export const info = (...params: LogMessageType[]): void => {
  logMessages(console.log, ...params)
}

/**
 * Error-level logging
 */
export const error = (...params: LogMessageType[]): void => {
  logMessages(console.error, ...params)
}

export const group = (label?: string) => console.group(label)
export const groupEnd = () => console.groupEnd()

Logger.prototype.info = function (...args: LogMessageType[]): Logger {
  info(...args)

  return this
}
Logger.prototype.error = function (...args: LogMessageType[]): Logger {
  error(...args)

  return this
}
Logger.prototype.group = function (label?: string): Logger {
  group(label)

  return this
}
Logger.prototype.groupEnd = function (): Logger {
  groupEnd()

  return this
}

const log = (...params: LogMessageType[]): Logger => new Logger(...params)

log.info = Logger.prototype.info.bind(log)
log.error = Logger.prototype.error.bind(log)
log.group = Logger.prototype.group.bind(log)
log.groupEnd = Logger.prototype.groupEnd.bind(log)

export default log
