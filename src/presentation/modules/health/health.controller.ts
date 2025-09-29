import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// Decorators
import { Public } from '@shared/decorators/public.decorator';

// Queries
import { GetHealthQuery } from '@application/queries/health/get-health.query';

// Response interfaces
import { HealthCheckResponse } from '@application/dtos';
import { SkipThrottle } from '@shared/decorators/throttle.decorator';

/**
 * Controller responsible for handling public health check requests.
 *
 * This controller exposes an endpoint that can be used by infrastructure or monitoring tools
 * to verify the application's health status. It returns information such as service status,
 * uptime, environment, and version, allowing external systems to monitor the application's availability.
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly queryBus: QueryBus) {}

  @Public()
  @Get()
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', format: 'date-time' },
        uptime: { type: 'number', example: 12345.67 },
        environment: { type: 'string', example: 'development' },
        version: { type: 'string', example: '1.0.0' },
      },
    },
  })
  async getHealth(): Promise<HealthCheckResponse> {
    return this.queryBus.execute(new GetHealthQuery());
  }
}
