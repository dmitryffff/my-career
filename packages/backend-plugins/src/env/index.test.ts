import { afterEach, describe, it, expect } from 'bun:test'
import Elysia from 'elysia'
import { z } from 'zod'
import { requestToApp } from '../lib/tests'
import { env } from './env'

const envSchema = z.object({
  A: z.string(),
})
const validEnv: z.infer<typeof envSchema> = {
  A: 'a',
}
const invalidEnv = {}

describe('env plugin', () => {
  let app = new Elysia()

  afterEach(() => {
    app = new Elysia()
  })

  it('is env exists', async () => {
    app.use(env(envSchema, validEnv)).get('/', (ctx) => {
      expect(ctx.env).not.toBeNil()
    })
    await requestToApp(app)
  })

  it('is env does not exist', async () => {
    app.get('/', (ctx) => {
      // @ts-expect-error -- need for test
      expect(ctx.env).not.toBeNil()
    })
    await requestToApp(app)
  })

  it('is passed schema validate Bun.env', () => {
    expect(() => env(envSchema, validEnv)).not.toThrow()
    expect(() => env(envSchema, invalidEnv)).toThrow()
  })
})
