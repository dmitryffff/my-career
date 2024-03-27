import pino from 'pino'

export const pinoLogger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

export const logger = (prefix: string): pino.Logger => {
  return new Proxy(pinoLogger, {
    get(target, property: pino.Level) {
      if (typeof target[property] === 'function') {
        return (msg: string | object, ...args: unknown[]) => {
          if (typeof msg === 'object') {
            target[property](
              msg,
              `${prefix} ${(args[0] as string | undefined) ?? ''}`,
              ...args,
            )
          } else {
            target[property](`${prefix} ${msg}`, ...args)
          }
        }
      }
      return target[property]
    },
  })
}
