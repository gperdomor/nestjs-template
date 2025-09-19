import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendVerificationEmailRequest } from '@application/dtos';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@core/services/auth.service';
import { EmailProvider } from '@presentation/modules/auth/providers/email.provider';

export class SendVerificationEmailCommand implements ICommand {
  constructor(public readonly dto: SendVerificationEmailRequest) {}
}

@Injectable()
@CommandHandler(SendVerificationEmailCommand)
export class SendVerificationEmailCommandHandler
  implements ICommandHandler<SendVerificationEmailCommand, { message: string }>
{
  constructor(
    private readonly authService: AuthService,
    private readonly emailProvider: EmailProvider,
  ) {}

  async execute(command: SendVerificationEmailCommand): Promise<{ message: string }> {
    const { email } = command.dto;

    // Generate a verification code
    const code = await this.authService.generateEmailVerificationCode(email);

    // Send the verification email
    await this.emailProvider.sendVerificationCode(email, code);

    return { message: 'Verification email sent successfully' };
  }
}
