import type { Prisma, PrismaClient, User } from '@prisma/client'
import { BaseService } from '@repo/backend-plugins/plugins'
import { error } from 'elysia'
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
        error(
          'Bad Request',
          ERROR_MESSAGES.EXISTS(this.entityName, 'номер телефона'),
        ),
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
    throw new Error('Not implemented')
  }
}
