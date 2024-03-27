import type Elysia from 'elysia'

export const requestToApp = async (
  app: Elysia,
  path = '/',
): Promise<unknown> => {
  const res = await app.handle(new Request(`http://localhost${path}`))
  return res.text()
}
