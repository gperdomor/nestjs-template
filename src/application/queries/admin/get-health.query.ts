import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { HealthCheckResponse } from '@application/dtos';

export class AdminGetHealthQuery implements IQuery {}

@Injectable()
@QueryHandler(AdminGetHealthQuery)
export class AdminGetHealthQueryHandler implements IQueryHandler<AdminGetHealthQuery> {
  constructor(@Inject(LoggerService) private readonly logger: LoggerService) {
    this.logger.setContext(AdminGetHealthQueryHandler.name);
  }

  async execute(): Promise<HealthCheckResponse> {
    this.logger.log({
      message: 'Admin checking health status',
      adminAction: true,
    });

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
