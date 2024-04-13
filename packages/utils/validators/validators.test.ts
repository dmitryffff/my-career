import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { phoneValidator } from './validators'

describe('Validators tests', () => {
  describe('Phone number validator', () => {
    it('Should validate', () => {
      expect(Value.Check(phoneValidator, '+1234567890')).toBeTrue()
      expect(Value.Check(phoneValidator, '+11234567890')).toBeTrue()
      expect(Value.Check(phoneValidator, '+15551234567890')).toBeTrue()
      expect(Value.Check(phoneValidator, '+331234567890')).toBeTrue()
      expect(Value.Check(phoneValidator, '+6212345678901234')).toBeTrue()
    })

    describe('Should not validate', () => {
      it('Missing "+"', () => {
        expect(Value.Check(phoneValidator, '1234567890')).not.toBeTrue()
      })

      it('Incorrect country code format', () => {
        expect(Value.Check(phoneValidator, '001234567890')).not.toBeTrue()
      })

      it('Too short/long', () => {
        expect(Value.Check(phoneValidator, '+1234')).not.toBeTrue()
        expect(
          Value.Check(phoneValidator, '+12345678901234567890'),
        ).not.toBeTrue()
      })

        expect(Value.Check(phoneValidator, '+12 34567890')).not.toBeTrue()
      })
    })
  })
})
