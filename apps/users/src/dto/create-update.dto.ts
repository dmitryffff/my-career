import type { Static } from 'elysia'
import { t } from 'elysia'
import { phoneValidator } from '@repo/utils/validators'

export const createUserDtoScheme = t.Object({
  phoneNumber: phoneValidator,
})

export type CreateUserDto = Static<typeof createUserDtoScheme>
