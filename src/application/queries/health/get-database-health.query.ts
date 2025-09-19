import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { DatabaseHealthResponse } from '@application/dtos';
import { HealthService } from '@core/services/health.service';

export class GetDatabaseHealthQuery implements IQuery {}

@Injectable()
@QueryHandler(GetDatabaseHealthQuery)
export class GetDatabaseHealthQueryHandler implements IQueryHandler<GetDatabaseHealthQuery> {
  constructor(private readonly healthService: HealthService) {}

  async execute(): Promise<DatabaseHealthResponse> {
    return this.healthService.getDatabaseHealth();
  }
}
