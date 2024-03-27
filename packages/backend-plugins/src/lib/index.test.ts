import { afterEach, describe, expect, it } from 'bun:test'
import Elysia, { NotFoundError } from 'elysia'
import { requestToApp } from './tests'

describe('tests utils', () => {
  let app = new Elysia()

  afterEach(() => {
    app = new Elysia()
  })

  it('is requestToApp is valid', async () => {
    const res = 'Hi!'
    app.get('/', () => res)
    expect(await requestToApp(app)).toBe(res)
  })

  it('is requestToApp is not valid', async () => {
    expect(await requestToApp(app)).toBe(new NotFoundError().message)
  })
})
