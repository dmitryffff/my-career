import { describe, expect, it } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import type { User } from '@prisma/client'
import { createUserDtoScheme } from './create-user.dto'
import { updateUserDto } from './update-user.dto'

type UserUpdatableProps = Partial<
  Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
>

describe('User`s dtos tests', () => {
  describe('Create user dto', () => {
    it('Valid dto', () => {
      expect(
        Value.Check(createUserDtoScheme, {
          phoneNumber: '+79211809476',
        }),
      ).toBeTrue()
    })

    it('External fields', () => {
      expect(
        Value.Check(createUserDtoScheme, {
          phoneNumber: '+79211809476',
          externalField: '',
        }),
      ).toBeFalse()
    })

    it('Invalid dto', () => {
      expect(Value.Check(createUserDtoScheme, {})).toBeFalse()
    })
  })

  describe('Update user dto', () => {
    it('Valid full dto', () => {
      const user: UserUpdatableProps = {
        phoneNumber: '+1234567890',
        email: 'fominienkovd@yandex.ru',
        firstName: 'Дмитрий',
        secondName: 'Фоминенков',
      }
      expect(Value.Check(updateUserDto, user)).toBeTrue()
    })

    it('Valid partial dto', () => {
      const user: UserUpdatableProps = {
        firstName: 'Дмитрий',
      }
      expect(Value.Check(updateUserDto, user)).toBeTrue()
    })

    it('If has phoneNumber must be valid', () => {
      expect(Value.Check(updateUserDto, { phoneNumber: null })).toBeFalse()
    })

    it('With nullable fields', () => {
      const user: UserUpdatableProps = {
        email: null,
        firstName: null,
        secondName: null,
      }
      expect(Value.Check(updateUserDto, user)).toBeTrue()
    })

    it('Empty dto', () => {
      expect(Value.Check(updateUserDto, {})).toBeTrue()
    })

    it('Invalid dto', () => {
      expect(Value.Check(updateUserDto, null)).toBeFalse()
      expect(Value.Check(updateUserDto, undefined)).toBeFalse()
      expect(Value.Check(updateUserDto, { externalField: '' })).toBeFalse()
      expect(
        Value.Check(updateUserDto, {
          firstName: '',
          secondName: '',
          email: '',
        }),
      ).toBeFalse()
    })
  })
})
