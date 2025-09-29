import { Controller, Post, Body, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';

// Guards & Decorators
import { Public } from '@shared/decorators/public.decorator';
import { CurrentUser } from '@shared/decorators/current-user.decorator';

// DTOs
import { LoginRequest, RefreshTokenRequest, IJwtPayload } from '@application/dtos';

// Commands
import { LoginCommand } from '@application/commands/auth/login.command';
import { RefreshTokenCommand } from '@application/commands/auth/refresh-token.command';
import { LogoutCommand } from '@application/commands/auth/logout.command';

// Services
import { UserAuthorizationService } from '@core/services/user-authorization.service';
import { IUserRepository } from '@core/repositories/user.repository.interface';
import { USER_REPOSITORY } from '@shared/constants/tokens';

@ApiTags('admin-auth')
@Controller('admin/auth')
@Public() // All endpoints in this controller are public
export class AdminAuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userAuthorizationService: UserAuthorizationService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login - validates admin privileges server-side' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin successfully authenticated with admin privileges verified',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin privileges' })
  async adminLogin(@Body() loginDto: LoginRequest) {
    const loginResult = await this.commandBus.execute(new LoginCommand(loginDto));

    // If login requires email verification or OTP, return that requirement
    if ('requiresEmailVerification' in loginResult || 'requiresOtp' in loginResult) {
      return loginResult;
    }

    // At this point, we have a successful login (AuthTokenResponse)
    // Server-side validation: Check if user has admin privileges
    const userEntity = await this.userRepository.findById(loginResult.user.id);
    if (!userEntity || !this.userAuthorizationService.canAccessAdminFeatures(userEntity)) {
      return {
        success: false,
        error: 'Access denied: Admin privileges required',
        statusCode: HttpStatus.FORBIDDEN,
      };
    }

    return loginResult;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh admin access token with admin validation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refreshed successfully with admin privileges re-verified',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid refresh token' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User lost admin privileges' })
  async adminRefreshToken(@Body() refreshTokenDto: RefreshTokenRequest) {
    const refreshResult = await this.commandBus.execute(new RefreshTokenCommand(refreshTokenDto));

    // Re-validate admin privileges on token refresh
    if ('user' in refreshResult) {
      const userEntity = await this.userRepository.findById(refreshResult.user.id);
      if (!userEntity || !this.userAuthorizationService.canAccessAdminFeatures(userEntity)) {
        return {
          success: false,
          error: 'Access denied: Admin privileges revoked',
          statusCode: HttpStatus.FORBIDDEN,
        };
      }
    }

    return refreshResult;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin logout' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Admin logged out successfully' })
  async adminLogout(@CurrentUser() user: IJwtPayload) {
    return this.commandBus.execute(new LogoutCommand(user.sub));
  }
}
