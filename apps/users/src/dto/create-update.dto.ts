import z from 'zod'

export const createUserDtoScheme = z
  .object({
    phoneNumber: z.string().regex(/^\d{10}$/gm),
  })
  .strict()

export type CreateUserDto = z.infer<typeof createUserDtoScheme>
