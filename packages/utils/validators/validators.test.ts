import { describe, it, expect } from 'bun:test'
import * as t from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import {
  emailValidator,
  extraLongTextValidator,
  longTextValidator,
  normalTextValidator,
  nullable,
  phoneValidator,
  shortTextValidator,
} from './validators'
import {
  MAX_LONG_LENGTH,
  MAX_NORMAL_LENGTH,
  MAX_SHORT_LENGTH,
  MIN_TEXT_LENGTH,
} from './constants'

describe('Validators tests', () => {
  describe('Phone number validator', () => {
    it('Valid', () => {
      expect(Value.Check(phoneValidator, '+1234567890')).toBeTrue()
      expect(Value.Check(phoneValidator, '+11234567890')).toBeTrue()
      expect(Value.Check(phoneValidator, '+15551234567890')).toBeTrue()
      expect(Value.Check(phoneValidator, '+331234567890')).toBeTrue()
      expect(Value.Check(phoneValidator, '+621234567890123')).toBeTrue()
    })

    describe('Invalid', () => {
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

  describe('Nullable validator', () => {
    it('Valid', () => {
      const nullableSchema = nullable(t.String())
      expect(Value.Check(nullableSchema, 'string')).toBeTrue()
      expect(Value.Check(nullableSchema, null)).toBeTrue()
    })

    it('Invalid', () => {
      const nullableSchema = nullable(t.String())
      expect(Value.Check(nullableSchema, 1)).toBeFalse()
      expect(Value.Check(nullableSchema, undefined)).toBeFalse()
      expect(Value.Check(nullableSchema, {})).toBeFalse()
    })
  })

  describe('Email validator', () => {
    it('Valid', () => {
      expect(Value.Check(emailValidator, 'fominienkovd@yandex.ru')).toBeTrue()
      expect(Value.Check(emailValidator, 'f@y.ru')).toBeTrue()
      expect(Value.Check(emailValidator, '1@2.ru')).toBeTrue()
      expect(Value.Check(emailValidator, '+12345678910@phone.com')).toBeTrue()
      expect(
        Value.Check(emailValidator, 'fominienkov.dima@yandex.ru'),
      ).toBeTrue()
    })

    it('Invalid', () => {
      expect(Value.Check(emailValidator, '@yandex.ru')).toBeFalse()
      expect(Value.Check(emailValidator, 'fominienkovdyandex.ru')).toBeFalse()
      expect(Value.Check(emailValidator, 'fominienkovd@yandexru')).toBeFalse()
      expect(Value.Check(emailValidator, 'fominienkovd@yandex.r')).toBeFalse()
      expect(Value.Check(emailValidator, '')).toBeFalse()
    })
  })

  describe('Text validators', () => {
    it('Valid', () => {
      const minText = '0'.repeat(MIN_TEXT_LENGTH)
      expect(Value.Check(shortTextValidator, minText)).toBeTrue()
      expect(
        Value.Check(shortTextValidator, '0'.repeat(MAX_SHORT_LENGTH)),
      ).toBeTrue()

      expect(Value.Check(normalTextValidator, minText)).toBeTrue()
      expect(
        Value.Check(normalTextValidator, '0'.repeat(MAX_NORMAL_LENGTH)),
      ).toBeTrue()

      expect(Value.Check(longTextValidator, minText)).toBeTrue()
      expect(
        Value.Check(longTextValidator, '0'.repeat(MAX_LONG_LENGTH)),
      ).toBeTrue()

      expect(Value.Check(extraLongTextValidator, minText)).toBeTrue()
      expect(
        // valid more than long text
        Value.Check(extraLongTextValidator, '0'.repeat(MAX_LONG_LENGTH + 1)),
      ).toBeTrue()
    })

    it('Invalid', () => {
      const lessThanMinText = '0'.repeat(MIN_TEXT_LENGTH - 1)
      expect(Value.Check(shortTextValidator, lessThanMinText)).toBeFalse()
      expect(
        Value.Check(shortTextValidator, '0'.repeat(MAX_SHORT_LENGTH + 1)),
      ).toBeFalse()

      expect(Value.Check(normalTextValidator, lessThanMinText)).toBeFalse()
      expect(
        Value.Check(normalTextValidator, '0'.repeat(MAX_NORMAL_LENGTH + 1)),
      ).toBeFalse()

      expect(Value.Check(longTextValidator, lessThanMinText)).toBeFalse()
      expect(
        Value.Check(longTextValidator, '0'.repeat(MAX_LONG_LENGTH + 1)),
      ).toBeFalse()

      expect(Value.Check(extraLongTextValidator, lessThanMinText)).toBeFalse()
      // extraLongTextValidator doesnt have length limit
    })
  })
})
