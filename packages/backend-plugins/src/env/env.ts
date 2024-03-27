import Elysia from 'elysia'
import type { z } from 'zod'

export const env = <T extends z.ZodRawShape>(
  scheme: z.ZodObject<T>,
  envObject = Bun.env,
) =>
  new Elysia().use((e) => {
    const parsedEnv = scheme.parse(envObject)
    return e.decorate('env', parsedEnv)
  })
