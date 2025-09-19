import { Module } from '@nestjs/common';
import { UserAuthorizationService } from './services/user-authorization.service';
import { HealthService } from './services/health.service';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';

/**
 * Core Domain Module
 * Contains all domain services and DDD infrastructure
 */
@Module({
  imports: [LoggerModule, ConfigModule, PrismaModule],
  providers: [UserAuthorizationService, HealthService],
  exports: [UserAuthorizationService, HealthService],
})
export class CoreModule {}
