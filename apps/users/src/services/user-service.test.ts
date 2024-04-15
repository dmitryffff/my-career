/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain -- only for tests */
/* eslint-disable @typescript-eslint/no-non-null-assertion -- only for tests */
import type { User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { ERROR_MESSAGES } from '@repo/utils/constants'
import { ServiceError } from '@repo/backend-plugins/plugins'
import type { CreateUserDto } from '../dto/create-user.dto'
import type { UpdateUserDto } from '../dto/update-user.dto'
import { UserService } from './user-service'

const client = new PrismaClient()
const userService = new UserService(client)

describe('User`s service tests', () => {
  describe(userService.createUser.name, () => {
    const methodName = userService.createUser.name

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
        new ServiceError(
          userService.serviceName,
          methodName,
          'Bad Request',
          ERROR_MESSAGES.EXISTS(userService.entityName, 'номер телефона'),
        ),
      )
    })
  })

  describe(userService.updateUser.name, () => {
    const methodName = userService.updateUser.name

    const testPhoneNumber = 'phoneNumber'
    let user: User | null = null
    beforeEach(async () => {
      user = await client.user.create({
        data: {
          phoneNumber: testPhoneNumber,
          email: 'testEmail',
          firstName: 'firstName',
          secondName: 'secondName',
        },
      })
    })

    afterEach(async () => {
      if (user !== null) {
        await client.user.delete({ where: { id: user.id } })
      }
    })

    it('Full update a user', async () => {
      const updateData: UpdateUserDto = {
        phoneNumber: 'newPhoneNumber',
        email: 'newEmail',
        firstName: 'newFirstName',
        secondName: 'newSecondName',
      }
      const updatedUser = await userService.updateUser(user?.id!, updateData)
      const fakeUpdateDate = new Date()
      updatedUser.updatedAt = fakeUpdateDate
      expect(updatedUser).toMatchObject({
        ...user,
        ...updateData,
      })
    })

    it('Partially update a user', async () => {
      const updateData: UpdateUserDto = {
        firstName: 'newFirstName',
      }
      const updatedUser = await userService.updateUser(user?.id!, updateData)
      const fakeUpdateDate = new Date()
      updatedUser.updatedAt = fakeUpdateDate
      expect(updatedUser).toMatchObject({
        ...user,
        ...updateData,
      })
    })

    it('Nullable update a user', async () => {
      const updateData: UpdateUserDto = {
        firstName: null,
      }
      const updatedUser = await userService.updateUser(user?.id!, updateData)
      const fakeUpdateDate = new Date()
      updatedUser.updatedAt = fakeUpdateDate
      expect(updatedUser).toMatchObject({
        ...user,
        ...updateData,
      })
    })

    it('User must exists', () => {
      expect(async () =>
        userService.updateUser('ab9f1830-64a4-4cf6-89af-b21d395f06b1', {
          firstName: null,
        }),
      ).toThrow(
        new ServiceError(
          userService.serviceName,
          methodName,
          'Bad Request',
          ERROR_MESSAGES.DOES_NOT_EXISTS(
            userService.entityName,
            'идентификатор',
          ),
        ),
      )
    })

    it('Cant duplicate phoneNumber', async () => {
      const existedPhoneNumber = 'existedPhoneNumber10'
      const existedUser = await client.user.create({
        data: {
          phoneNumber: existedPhoneNumber,
        },
      })
      expect(async () =>
        userService.updateUser(user?.id!, {
          phoneNumber: existedPhoneNumber,
        }),
      ).toThrow(
        new ServiceError(
          userService.serviceName,
          methodName,
          'Bad Request',
          ERROR_MESSAGES.EXISTS(userService.entityName, 'номер телефона'),
        ),
      )
      await client.user.delete({ where: { id: existedUser.id } })
    })

    it('updatedAt must changes', async () => {
      expect(
        (
          await userService.updateUser(user?.id!, {
            firstName: 'newFirstName',
          })
        ).updatedAt.getTime(),
      ).not.toBe(user?.updatedAt.getTime())
    })
  })
})
