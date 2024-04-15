import type { PrismaClient } from '@prisma/client'
import type * as pino from 'pino'
import type { error } from 'elysia'
import { logger } from '../logger'
import { ServiceError } from './service-error'

/**
 * @param name - must be a name of an entity: `'user'`, `'role'` with `PrismaClient[name]` type is `UserDelegate` or `RoleDelegate` etc.
 */
export class BaseService<T> {
  public readonly serviceName: string
  public readonly repository: T
  protected readonly log: pino.Logger
  protected readonly throwError: (
    method: string,
    status: Parameters<typeof error>[0],
    msg: string,
  ) => never

  constructor(name: keyof PrismaClient, client: PrismaClient) {
    this.serviceName = `${name as string}Service`
    this.repository = client[name] as T
    this.log = logger(this.serviceName)
    this.throwError = (
      method: string,
      status: Parameters<typeof error>[0],
      msg: string,
    ) => {
      throw new ServiceError(this.serviceName, method, status, msg)
    }
  }
}
