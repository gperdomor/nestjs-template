import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from '@core/repositories/user.repository.interface';
import { IJwtPayload } from '@application/dtos';
import { USER_REPOSITORY } from '@shared/constants/tokens';
import { User } from '@core/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    // Check if the user still exists
    const user = await this.userRepository.findById(payload.sub);

    // If a user is not found or not active, throw an UnauthorizedException
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User no longer active or not found');
    }

    // Return the complete User entity which will be injected into the request object
    // This ensures that guards like PermissionsGuard have access to all user methods
    // including hasPermission() and the isActive property
    return user;
  }
}
