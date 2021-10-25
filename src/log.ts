type PossibleLogMessageType = unknown | Record<string, unknown>
type LogMessageType = PossibleLogMessageType | PossibleLogMessageType[]

type Logger = {
  info: (...params: LogMessageType[]) => void
  error: (...params: LogMessageType[]) => void
  group: (label?: string) => void
  groupEnd: () => void
  (...params: LogMessageType[]): void
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
 * @param params Anything you can pass to console.log
 */
function log(this: Logger, ...params: LogMessageType[]): Logger {
  logMessages(console.log, ...params)

  return this
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

log.prototype.info = function (...args: LogMessageType[]): Logger {
  info(...args)

  return this
}
log.prototype.error = function (...args: LogMessageType[]): Logger {
  error(...args)

  return this
}
log.prototype.group = function (label: string): Logger {
  group(label)

  return this
}
log.prototype.groupEnd = function (): Logger {
  groupEnd()

  return this
}

export default log
