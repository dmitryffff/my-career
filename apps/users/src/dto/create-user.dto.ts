import { phoneValidator } from '@repo/utils/validators'
import * as t from '@sinclair/typebox'

export const createUserDtoScheme = t.Object(
  {
    phoneNumber: phoneValidator,
  },
  { additionalProperties: false },
)

export type CreateUserDto = t.Static<typeof createUserDtoScheme>
