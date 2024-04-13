import type { User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { describe, expect, it } from 'bun:test'
import { ERROR_MESSAGES } from '@repo/utils/constants'
import { ServiceError } from '@repo/backend-plugins/plugins'
import { error } from 'elysia'
import type { CreateUserDto } from '../dto/create-update.dto'
import { UserService } from './user-service'

const client = new PrismaClient()
const userService = new UserService(client)

describe('User`s service tests', () => {
  describe('Create a user', () => {
    it('Must create a user', async () => {
      const user = await userService.createUser({
        // a unique phone number
        phoneNumber: '+0000000000',
      })

      expect(user).toHaveProperty('id')
      await client.user.delete({ where: { id: user.id } })
    })

    it('Must throw an error', () => {
      expect(() => userService.createUser({} as CreateUserDto)).toThrow()
      expect(() =>
        // @ts-expect-error -- we need to pass an invalid object
        userService.create({ phoneNumber: 79211809476 } as User),
      ).toThrow()
    })

    it('Duplicate phone number must throw a service error', () => {
      expect(async () => {
        await userService.createUser({ phoneNumber: '+1234567891' })
        await userService.createUser({ phoneNumber: '+1234567891' })
      }).toThrow(
        ServiceError.getErrorMessage(
          'userService',
          'createUser',
          error(
            'Bad Request',
            ERROR_MESSAGES.EXISTS(userService.entityName, 'номер телефона'),
          ),
        ),
      )
    })
  })
})
