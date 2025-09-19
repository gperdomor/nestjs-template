import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@core/repositories/user.repository.interface';
import { UserDetailResponse } from '@application/dtos';
import { UserMapper } from '@application/mappers/user.mapper';
import { USER_REPOSITORY } from '@shared/constants/tokens';

export class GetUsersQuery implements IQuery {}

@Injectable()
@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<UserDetailResponse[]> {
    const users = await this.userRepository.findAll();

    // Use the mapper to convert each user to response DTO
    return users.map(user => UserMapper.toDetailResponse(user));
  }
}
