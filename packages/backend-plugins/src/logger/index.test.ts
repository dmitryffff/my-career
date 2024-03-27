import { afterEach, describe, expect, it } from 'bun:test'
import Elysia from 'elysia'
import { logger } from './logger'

describe('logger plugin', () => {
  let app = new Elysia()
  afterEach(() => {
    app = new Elysia()
  })

  it('is logger exists', () => {
    const p = '/'
    app
      .derive(({ path }) => ({
        log: logger(path),
      }))
      .get(p, (ctx) => {
        // TODO: add checking if a console message has p(path)
        expect(ctx.log).not.toBeNil()
      })
  })

  it('is logger does not exist', () => {
    const p = '/'
    app.get(p, (ctx) => {
      // @ts-expect-error -- need for test
      expect(ctx.log).toBeUndefined()
    })
  })
})
