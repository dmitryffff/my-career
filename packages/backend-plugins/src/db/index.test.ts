import { describe, expect, it, mock, afterEach } from 'bun:test'
import Elysia from 'elysia'
import type { PrismaClient } from '@prisma/client'
import { requestToApp } from '../lib/tests'
import { db } from './db'

const createPrismaClient = mock<() => PrismaClient>(() => ({}) as PrismaClient)

describe('db plugin', () => {
  let app = new Elysia()

  afterEach(() => {
    app = new Elysia()
  })

  it('is db exists', async () => {
    app.use(db(createPrismaClient())).get('/', (e) => {
      expect(e.db).not.toBeNil()
    })
    await requestToApp(app)
  })

  it('is db does not exist', async () => {
    app.get('/', (e) => {
      // @ts-expect-error -- need for the test
      expect(e.db).toBeUndefined()
    })
    await requestToApp(app)
  })
})
