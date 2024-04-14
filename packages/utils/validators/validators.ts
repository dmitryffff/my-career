import * as t from '@sinclair/typebox'
import {
  EMAIL_REGEX,
  MAX_EXTRA_LONG_LENGTH,
  MAX_LONG_LENGTH,
  MAX_NORMAL_LENGTH,
  MAX_SHORT_LENGTH,
  MIN_TEXT_LENGTH,
  PHONE_REGEX,
} from './constants'

export const nullable = <T extends t.TSchema>(type: T): t.Union<[T, t.TNull]> =>
  t.Union([type, t.Null()])
export const phoneValidator = t.RegExp(PHONE_REGEX)
export const emailValidator = t.RegExp(EMAIL_REGEX)
export const shortTextValidator = t.String({
  minLength: MIN_TEXT_LENGTH,
  maxLength: MAX_SHORT_LENGTH,
})
export const normalTextValidator = t.String({
  minLength: MIN_TEXT_LENGTH,
  maxLength: MAX_NORMAL_LENGTH,
})
export const longTextValidator = t.String({
  minLength: MIN_TEXT_LENGTH,
  maxLength: MAX_LONG_LENGTH,
})
export const extraLongTextValidator = t.String({
  minLength: MIN_TEXT_LENGTH,
  maxLength: MAX_EXTRA_LONG_LENGTH,
})
