import { ELYSIA_RESPONSE } from 'elysia'
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
  public status: number
  public msg: string

  constructor(
    public serviceName: string,
    public methodName: string,
    err: ReturnType<typeof error>,
  ) {
    super(ServiceError.getErrorMessage(serviceName, methodName, err))
    this.status = err[ELYSIA_RESPONSE]
    this.msg = err.response as string
  }

  static getErrorMessage(
    serviceName: string,
    methodName: string,
    err: ReturnType<typeof error>,
  ): string {
    return [serviceName, methodName, err[ELYSIA_RESPONSE], err.response].join(
      SPLITTER,
    )
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
