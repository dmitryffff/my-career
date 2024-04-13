import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { ruPhoneValidator } from './validators'

describe('Validators tests', () => {
  describe('Phone number validator', () => {
    it('Must not throw with a valid phone number', () => {
      const validPhoneNumber = '9211809476'
      expect(Value.Check(ruPhoneValidator, validPhoneNumber)).toBeTrue()
    })

    it('Must throw with an invalid phone number', () => {
      let invalidPhoneNumber = '921'
      expect(Value.Check(ruPhoneValidator, invalidPhoneNumber)).toBeFalse()
      invalidPhoneNumber = '92118094769211809476'
      expect(Value.Check(ruPhoneValidator, invalidPhoneNumber)).toBeFalse()
      invalidPhoneNumber = '921180947a'
      expect(Value.Check(ruPhoneValidator, invalidPhoneNumber)).toBeFalse()
    })
  })
})
