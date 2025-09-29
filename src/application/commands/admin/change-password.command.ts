import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { UserService } from '@core/services/user.service';
import { LoggerService } from '@infrastructure/logger/logger.service';

export class AdminChangePasswordCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly newPassword: string,
  ) {}
}

@Injectable()
@CommandHandler(AdminChangePasswordCommand)
export class AdminChangePasswordCommandHandler
  implements ICommandHandler<AdminChangePasswordCommand>
{
  constructor(
    private readonly userService: UserService,
    @Inject(LoggerService) private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AdminChangePasswordCommandHandler.name);
  }

  async execute(command: AdminChangePasswordCommand): Promise<void> {
    const { userId, newPassword } = command;

    this.logger.log({
      message: 'Admin changing user password',
      userId,
      adminAction: true,
    });

    // Admin can change password without current password verification
    await this.userService.changePassword(userId, newPassword);

    this.logger.log({
      message: 'Admin password change completed',
      userId,
      adminAction: true,
    });
  }
}
