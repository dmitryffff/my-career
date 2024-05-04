import type { Prisma, PrismaClient, User } from '@prisma/client'
import { BaseService } from '@repo/backend-plugins/plugins'
import { ERROR_MESSAGES } from '@repo/utils/constants'
import type { CreateUserDto } from '../dto/create-user.dto'
import type { UpdateUserDto } from '../dto/update-user.dto'

export class UserService extends BaseService<Prisma.UserDelegate> {
  entityName = 'пользователь'

  constructor(prismaClient: PrismaClient) {
    super('user', prismaClient)
  }

  public readonly createUser = async (dto: CreateUserDto): Promise<User> => {
    const existedUser = await this.repository.findUnique({
      where: { phoneNumber: dto.phoneNumber },
    })
    if (existedUser !== null) {
      this.throwError(
        'createUser',
        'Bad Request',
        ERROR_MESSAGES.EXISTS(this.entityName, 'номер телефона'),
      )
    }

    return this.repository.create({
      data: { phoneNumber: dto.phoneNumber },
    })
  }

  public readonly updateUser = async (
    userId: string,
    dto: UpdateUserDto,
  ): Promise<User> => {
    const user = await this.repository.findUnique({ where: { id: userId } })
    if (user === null) {
      this.throwError(
        this.updateUser.name,
        'Bad Request',
        ERROR_MESSAGES.DOES_NOT_EXISTS(this.entityName, 'идентификатор'),
      )
    }

    if (dto.phoneNumber !== undefined) {
      const existedUser = await this.repository.findUnique({
        where: { phoneNumber: dto.phoneNumber },
      })
      if (existedUser !== null && existedUser.id !== userId) {
        this.throwError(
          this.updateUser.name,
          'Bad Request',
          ERROR_MESSAGES.EXISTS(this.entityName, 'номер телефона'),
        )
      }
    }

    return this.repository.update({ where: { id: userId }, data: dto })
  }

  public readonly deleteUser = async (userId: string): Promise<string> => {
    const user = await this.repository.findUnique({ where: { id: userId } })
    if (user === null) {
      this.throwError(
        this.deleteUser.name,
        'Bad Request',
        ERROR_MESSAGES.DOES_NOT_EXISTS(this.entityName, 'идентификатор'),
      )
    }
    await this.repository.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    })
    return userId
  }
}
