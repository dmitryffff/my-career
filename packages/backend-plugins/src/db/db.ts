import type { PrismaClient } from '@prisma/client'
import Elysia from 'elysia'

export const db = (client: PrismaClient) => new Elysia().decorate('db', client)
