import { describe, expect, it } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { createUserDtoScheme } from './create-update.dto'

describe('User`s dtos tests', () => {
  describe('Create user dto', () => {
    it('Valid dto', () => {
      expect(
        Value.Check(createUserDtoScheme, {
          phoneNumber: '+79211809476',
        }),
      ).toBeTrue()
    })

    it('Invalid dto', () => {
      expect(Value.Check(createUserDtoScheme, {})).toBeFalse()
    })
  })
})
