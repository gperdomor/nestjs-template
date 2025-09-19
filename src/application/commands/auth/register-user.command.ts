import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterRequest, UserBaseResponse } from '@application/dtos';
import { Injectable } from '@nestjs/common';
import { UserService } from '@core/services/user.service';
import { UserMapper } from '@application/mappers/user.mapper';

export class RegisterUserCommand implements ICommand {
  constructor(public readonly registerDto: RegisterRequest) {}
}

@Injectable()
@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(private readonly userService: UserService) {}

  async execute(command: RegisterUserCommand): Promise<UserBaseResponse> {
    const { email, password, firstName, lastName } = command.registerDto;

    const user = await this.userService.createUser(email, password, firstName, lastName);

    // Use the mapper to convert to response DTO
    return UserMapper.toBaseResponse(user);
  }
}
