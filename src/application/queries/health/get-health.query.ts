import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { HealthCheckResponse } from '@application/dtos';
import { HealthService } from '@core/services/health.service';

export class GetHealthQuery implements IQuery {}

@Injectable()
@QueryHandler(GetHealthQuery)
export class GetHealthQueryHandler implements IQueryHandler<GetHealthQuery> {
  constructor(private readonly healthService: HealthService) {}

  async execute(): Promise<HealthCheckResponse> {
    return this.healthService.getHealth();
  }
}
