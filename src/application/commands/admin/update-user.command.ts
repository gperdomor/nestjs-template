import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { UserService } from '@core/services/user.service';
import { LoggerService } from '@infrastructure/logger/logger.service';

export class AdminUpdateUserCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly email?: string,
  ) {}
}

@Injectable()
@CommandHandler(AdminUpdateUserCommand)
export class AdminUpdateUserCommandHandler implements ICommandHandler<AdminUpdateUserCommand> {
  constructor(
    private readonly userService: UserService,
    @Inject(LoggerService) private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AdminUpdateUserCommandHandler.name);
  }

  async execute(command: AdminUpdateUserCommand): Promise<void> {
    const { userId, firstName, lastName, email } = command;

    this.logger.log({
      message: 'Admin updating user',
      userId,
      adminAction: true,
    });

    await this.userService.updateUserDetails(userId, firstName, lastName, email);

    this.logger.log({
      message: 'Admin user update completed',
      userId,
      adminAction: true,
    });
  }
}
