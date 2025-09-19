import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '@core/services/user.service';
import { UserDetailResponse } from '@application/dtos';
import { UserMapper } from '@application/mappers/user.mapper';

export class RemoveRoleCommand {
  constructor(
    public readonly userId: string,
    public readonly roleId: string,
  ) {}
}

@CommandHandler(RemoveRoleCommand)
export class RemoveRoleCommandHandler
  implements ICommandHandler<RemoveRoleCommand, UserDetailResponse>
{
  constructor(private readonly userService: UserService) {}

  async execute(command: RemoveRoleCommand): Promise<UserDetailResponse> {
    const { userId, roleId } = command;

    const user = await this.userService.removeRoleFromUser(userId, roleId);

    // Use the mapper to convert to response DTO
    return UserMapper.toDetailResponse(user);
  }
}
