import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@core/repositories/user.repository.interface';
import { UserDetailResponse } from '@application/dtos';
import { UserMapper } from '@application/mappers/user.mapper';
import { USER_REPOSITORY } from '@shared/constants/tokens';

export interface IGetUsersResult {
  users: UserDetailResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetUsersQuery implements IQuery {
  constructor(
    public readonly search?: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}

@Injectable()
@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery, IGetUsersResult> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUsersQuery): Promise<IGetUsersResult> {
    const { search, page, limit } = query;
    const offset = (page - 1) * limit;

    const { users, total } = await this.userRepository.findWithFilters({
      search,
      limit,
      offset,
    });

    return {
      users: users.map(user => UserMapper.toDetailResponse(user)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
