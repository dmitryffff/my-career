import { PrismaClient } from '@prisma/client'
import {
  ServiceError,
  db,
  env,
  logger,
  pinoLogger,
} from '@repo/backend-plugins/plugins'
import { Elysia } from 'elysia'
import z from 'zod'
import { ERROR_MESSAGES } from '@repo/utils/constants'
import { UserService } from './services/user-service'
import { createUpdateUserDtoScheme } from './dto/create-user.dto'

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

const prismaClient = new PrismaClient()
const userService = new UserService(prismaClient)

const app = new Elysia()
  .error({
    SERVICE_ERROR: ServiceError,
  })
  .derive(({ path }) => ({
    log: logger(path),
  }))
  .onError(({ path, code, error, set }) => {
    logger(path).error(error)
    if (code === 'SERVICE_ERROR') {
      set.status = error.status
    }

    if (code === 'INTERNAL_SERVER_ERROR') {
      set.status = error.status
      return new Response(ERROR_MESSAGES.SERVER_ERROR)
    }

    return new Response(error.message)
  })
  .use(env(envSchema))
  .use(db(prismaClient))
  .decorate('userService', userService)
  .post(
    '/',
    async (ctx) => {
      await ctx.userService.createUser(ctx.body)
      return `Hello!`
    },
    {
      body: createUpdateUserDtoScheme,
    },
  )
  .listen(Bun.env.PORT, (s) => {
    pinoLogger.info(`🦊 Elysia is running at ${s.hostname}:${s.port}`)
  })
