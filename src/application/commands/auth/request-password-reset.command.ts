import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestPasswordResetRequest } from '@application/dtos';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@core/services/auth.service';
import { EmailProvider } from '@presentation/modules/auth/providers/email.provider';
import { EntityNotFoundException } from '@core/exceptions/domain-exceptions';

export class RequestPasswordResetCommand implements ICommand {
  constructor(public readonly dto: RequestPasswordResetRequest) {}
}

@Injectable()
@CommandHandler(RequestPasswordResetCommand)
export class RequestPasswordResetCommandHandler
  implements ICommandHandler<RequestPasswordResetCommand, { message: string }>
{
  constructor(
    private readonly authService: AuthService,
    private readonly emailProvider: EmailProvider,
  ) {}

  async execute(command: RequestPasswordResetCommand): Promise<{ message: string }> {
    const { email } = command.dto;

    try {
      // Generate a reset token
      const token = await this.authService.createPasswordResetToken(email);

      // Send the password reset email
      await this.emailProvider.sendPasswordResetEmail(email, token);

      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        // For security reasons, we don't want to reveal whether an email exists in our system
        return {
          message:
            'If your email exists in our system, you will receive a password reset link shortly',
        };
      }
      throw error;
    }
  }
}
