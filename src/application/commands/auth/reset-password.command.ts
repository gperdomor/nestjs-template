import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordRequest } from '@application/dtos';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import {
  EntityNotFoundException,
  OtpExpiredException,
  OtpInvalidException,
} from '@core/exceptions/domain-exceptions';

export class ResetPasswordCommand implements ICommand {
  constructor(public readonly dto: ResetPasswordRequest) {}
}

@Injectable()
@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler
  implements ICommandHandler<ResetPasswordCommand, { success: boolean; message: string }>
{
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<{ success: boolean; message: string }> {
    const { token, newPassword } = command.dto;

    try {
      // Hash the new password
      const passwordHash = await this.userService.hashPassword(newPassword);

      // Reset the password
      await this.authService.resetPassword(token, passwordHash);

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw new UnauthorizedException('Invalid or expired token');
      } else if (error instanceof OtpExpiredException) {
        throw new UnauthorizedException('Password reset token has expired');
      } else if (error instanceof OtpInvalidException) {
        throw new UnauthorizedException('Password reset token has already been used');
      }
      throw new BadRequestException('Failed to reset password');
    }
  }
}
