import type { Prisma, User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import {
  BaseService,
  db,
  env,
  logger,
  pinoLogger,
} from '@repo/backend-plugins/plugins'
import { Elysia } from 'elysia'
import z from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_DB: z.string(),
  POSTGRES_SCHEMA: z.string(),
  DATABASE_URL: z.string(),
})

export class UserService extends BaseService<Prisma.UserDelegate> {
  constructor(prismaClient: PrismaClient) {
    super('user', prismaClient)
  }

  public readonly create = async (): Promise<User> => {
    try {
      return await this.repository.create({
        data: { name: 'Дима', email: '123123@mail.ru', age: 23 },
      })
    } catch (error) {
      const e = error as Error
      this.log.error(e)
      this.throwError(e.message)
    }
  }
}

const prismaClient = new PrismaClient()
const userService = new UserService(prismaClient)

const app = new Elysia()
  .use(env(envSchema))
  .use(db(prismaClient))
  .decorate('userService', userService)
  .derive(({ path }) => ({
    log: logger(path),
  }))
  .get('/', async (ctx) => {
    await ctx.userService.create()
    return `Hello!`
  })
  .listen(Bun.env.PORT, (s) => {
    pinoLogger.info(`🦊 Elysia is running at ${s.hostname}:${s.port}`)
  })
