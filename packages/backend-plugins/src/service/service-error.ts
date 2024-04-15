import type { error } from 'elysia'

const SPLITTER = '|'

interface ParsedError {
  serviceName: string
  methodName: string
  code: number
  msg: string
}

export class ServiceError extends Error {
  public readonly _splitter = SPLITTER

  constructor(
    public readonly serviceName: string,
    public readonly methodName: string,
    public readonly status: Parameters<typeof error>[0],
    public readonly msg: string,
  ) {
    super([serviceName, methodName, status, msg].join(SPLITTER))
  }

  static parseError(err: string): ParsedError {
    const [serviceName, methodName, code, msg] = err.split(SPLITTER)
    return {
      serviceName: serviceName ?? '',
      methodName: methodName ?? '',
      code: code !== undefined ? Number(code) : 0,
      msg: msg ?? '',
    }
  }
}
