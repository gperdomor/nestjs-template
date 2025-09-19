import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { LivenessResponse } from '@application/dtos';
import { HealthService } from '@core/services/health.service';

export class GetLivenessQuery implements IQuery {}

@Injectable()
@QueryHandler(GetLivenessQuery)
export class GetLivenessQueryHandler implements IQueryHandler<GetLivenessQuery> {
  constructor(private readonly healthService: HealthService) {}

  async execute(): Promise<LivenessResponse> {
    return this.healthService.getLiveness();
  }
}
