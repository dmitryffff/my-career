import {
  emailValidator,
  nullable,
  phoneValidator,
  shortTextValidator,
} from '@repo/utils/validators'
import * as t from '@sinclair/typebox'

export const updateUserDto = t.Partial(
  t.Object(
    {
      phoneNumber: phoneValidator,
      email: nullable(emailValidator),
      firstName: nullable(shortTextValidator),
      secondName: nullable(shortTextValidator),
    },
    { additionalProperties: false },
  ),
)

export type UpdateUserDto = t.Static<typeof updateUserDto>
