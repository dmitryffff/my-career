import type { Prisma, PrismaClient, User } from '@prisma/client'
import { BaseService } from '@repo/backend-plugins/plugins'

export class UserService extends BaseService<Prisma.UserDelegate> {
  constructor(prismaClient: PrismaClient) {
    super('user', prismaClient)
  }

  public readonly create = async (): Promise<User> => {
    try {
      return await this.repository.create({
        data: { name: 'Дима', email: '123123@mail.ru', age: 23 },
      })
    } catch (error) {
      const e = error as Error
      this.log.error(e)
      this.throwError(e.message)
    }
  }
}
