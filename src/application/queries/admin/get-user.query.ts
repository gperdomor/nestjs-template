import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { UserService } from '@core/services/user.service';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { UserDetailResponse } from '@application/dtos';
import { UserMapper } from '@application/mappers/user.mapper';

export class AdminGetUserQuery implements IQuery {
  constructor(public readonly userId: string) {}
}

@Injectable()
@QueryHandler(AdminGetUserQuery)
export class AdminGetUserQueryHandler implements IQueryHandler<AdminGetUserQuery> {
  constructor(
    private readonly userService: UserService,
    @Inject(LoggerService) private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AdminGetUserQueryHandler.name);
  }

  async execute(query: AdminGetUserQuery): Promise<UserDetailResponse> {
    const { userId } = query;

    this.logger.log({
      message: 'Admin fetching user',
      userId,
      adminAction: true,
    });

    const user = await this.userService.getUserById(userId);

    return UserMapper.toDetailResponse(user);
  }
}
