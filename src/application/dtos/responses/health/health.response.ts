import { ApiProperty } from '@nestjs/swagger';

interface IHealthServiceInfo {
  status: 'up' | 'down';
  message?: string;
  responseTime?: number;
  metadata?: Record<string, string | number | boolean>;
}

interface IHealthErrorInfo {
  message: string;
  stack?: string;
  code?: string;
  details?: Record<string, string | number | boolean>;
}

export class HealthCheckResponse {
  @ApiProperty({
    description: 'Overall health status',
    example: 'ok',
    enum: ['ok', 'error'],
  })
  status!: 'ok' | 'error';

  @ApiProperty({
    description: 'Health check timestamp',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  timestamp?: string;

  @ApiProperty({
    description: 'System uptime in seconds',
    example: 123456,
    required: false,
  })
  uptime?: number;

  @ApiProperty({
    description: 'Application environment',
    example: 'production',
    required: false,
  })
  environment?: string;

  @ApiProperty({
    description: 'Application version',
    example: '1.0.0',
    required: false,
  })
  version?: string;

  @ApiProperty({
    description: 'Health check details by service',
    example: {
      database: { status: 'up' },
      redis: { status: 'up' },
    },
    required: false,
  })
  info?: Record<string, IHealthServiceInfo>;

  @ApiProperty({
    description: 'Error details if any service is down',
    example: {},
    required: false,
  })
  error?: Record<string, IHealthErrorInfo>;

  @ApiProperty({
    description: 'Detailed service information including response times',
    example: {
      database: { status: 'up', responseTime: 5 },
      redis: { status: 'up', responseTime: 2 },
    },
    required: false,
  })
  details?: Record<string, IHealthServiceInfo>;
}

export class DatabaseHealthResponse {
  @ApiProperty({
    description: 'Database health status',
    example: 'ok',
    enum: ['ok', 'error'],
  })
  status!: 'ok' | 'error';

  @ApiProperty({
    description: 'Database connection status',
    example: 'connected',
  })
  database!: string;

  @ApiProperty({
    description: 'Health check timestamp',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  timestamp?: string;

  @ApiProperty({
    description: 'Database connection details',
    example: { database: { status: 'up' } },
    required: false,
  })
  info?: Record<string, IHealthServiceInfo>;

  @ApiProperty({
    description: 'Database error details if connection failed',
    required: false,
  })
  error?: Record<string, IHealthErrorInfo>;

  @ApiProperty({
    description: 'Detailed database information',
    example: { database: { status: 'up', responseTime: 5 } },
    required: false,
  })
  details?: Record<string, IHealthServiceInfo>;
}

export class ReadinessResponse {
  @ApiProperty({
    description: 'Readiness check status',
    example: 'ready',
    enum: ['ok', 'error', 'ready'],
  })
  status!: 'ok' | 'error' | 'ready';

  @ApiProperty({
    description: 'Health check timestamp',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  timestamp?: string;

  @ApiProperty({
    description: 'Readiness check results',
    example: { database: 'ok', config: 'ok' },
    required: false,
  })
  checks?: Record<string, string>;

  @ApiProperty({
    description: 'Readiness check details',
    example: { database: { status: 'up' } },
    required: false,
  })
  info?: Record<string, IHealthServiceInfo>;

  @ApiProperty({
    description: 'Error details if readiness check failed',
    required: false,
  })
  error?: Record<string, IHealthErrorInfo>;

  @ApiProperty({
    description: 'Detailed readiness information',
    example: { database: { status: 'up' } },
    required: false,
  })
  details?: Record<string, IHealthServiceInfo>;
}

export class LivenessResponse {
  @ApiProperty({
    description: 'Liveness check status',
    example: 'alive',
    enum: ['ok', 'error', 'alive'],
  })
  status!: 'ok' | 'error' | 'alive';

  @ApiProperty({
    description: 'Health check timestamp',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  timestamp?: string;

  @ApiProperty({
    description: 'System uptime in seconds',
    example: 123456,
    required: false,
  })
  uptime?: number;

  @ApiProperty({
    description: 'Liveness check details',
    example: { memory_heap: { status: 'up' } },
    required: false,
  })
  info?: Record<string, IHealthServiceInfo>;

  @ApiProperty({
    description: 'Error details if liveness check failed',
    required: false,
  })
  error?: Record<string, IHealthErrorInfo>;

  @ApiProperty({
    description: 'Detailed liveness information',
    example: { memory_heap: { status: 'up' } },
    required: false,
  })
  details?: Record<string, IHealthServiceInfo>;
}

export class HealthCheckDetailResponse {
  @ApiProperty({
    description: 'Service status',
    example: 'up',
    enum: ['up', 'down', 'ok', 'error'],
  })
  status!: 'up' | 'down' | 'ok' | 'error';

  @ApiProperty({
    description: 'Response time in milliseconds',
    example: 5,
    required: false,
  })
  responseTime?: number;

  [key: string]: string | number | boolean | undefined;
}

export class ComprehensiveHealthResponse {
  @ApiProperty({
    description: 'Overall system health status',
    example: 'ok',
    enum: ['ok', 'degraded', 'down'],
  })
  status!: 'ok' | 'degraded' | 'down';

  @ApiProperty({
    description: 'Timestamp of health check',
    example: '2024-01-01T00:00:00.000Z',
  })
  timestamp!: string;

  @ApiProperty({
    description: 'Uptime in seconds',
    example: 123456,
  })
  uptime!: number;

  @ApiProperty({
    description: 'Application environment',
    example: 'production',
    required: false,
  })
  environment?: string;

  @ApiProperty({
    description: 'Application version',
    example: '1.0.0',
    required: false,
  })
  version?: string;

  @ApiProperty({
    description: 'Individual health check results',
    type: [HealthCheckDetailResponse],
  })
  checks!: HealthCheckDetailResponse[];
}
