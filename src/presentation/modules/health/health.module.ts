import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Controllers
import { HealthController } from './health.controller';

// Core Module for domain services
import { CoreModule } from '@core/core.module';

// Basic health handlers only (detailed health info is in AdminModule)
import { GetHealthQueryHandler } from '@application/queries/health/get-health.query';

const queryHandlers = [
  GetHealthQueryHandler, // Only basic health status for public access
];

@Module({
  imports: [CqrsModule, CoreModule],
  controllers: [HealthController],
  providers: [
    // Query handlers
    ...queryHandlers,
  ],
})
export class HealthModule {}
