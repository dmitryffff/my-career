import { RegExp } from '@sinclair/typebox'
import { PHONE_REGEX } from './regex'

export const phoneValidator = RegExp(PHONE_REGEX)
