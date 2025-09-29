import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';

// Guards & Decorators
import { PermissionsGuard } from '@presentation/guards/permissions.guard';
import { RequiresAdmin } from '@shared/decorators/admin.decorator';
import { RequiresSensitive } from '@shared/decorators/sensitive.decorator';
import { RequiresResourceAction } from '@shared/decorators/resource-action.decorator';
import { ResourceType, ActionType } from '@core/value-objects/resource-action.vo';

@ApiTags('admin')
@Controller('admin')
@UseGuards(PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get('dashboard')
  @RequiresAdmin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get admin dashboard data (Admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns dashboard statistics' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have admin role' })
  async getDashboard() {
    return {
      message: 'Admin dashboard data',
      stats: {
        totalUsers: 0,
        activeUsers: 0,
        totalRoles: 0,
      },
    };
  }

  @Get('system-info')
  @RequiresAdmin()
  @HttpCode(HttpStatus.OK)
  @RequiresSensitive()
  @ApiOperation({ summary: 'Get system information (Requires 2FA)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns system information' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User does not have 2FA enabled' })
  async getSystemInfo() {
    return {
      message: 'Sensitive system information',
      system: {
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        uptime: process.uptime(),
      },
    };
  }

  @Get('audit-logs')
  @RequiresAdmin()
  @HttpCode(HttpStatus.OK)
  @RequiresResourceAction(ResourceType.AUDIT, ActionType.READ)
  @ApiOperation({ summary: 'Get audit logs (Requires specific permission)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns audit logs' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have audit:read permission',
  })
  async getAuditLogs() {
    return {
      message: 'Audit logs data',
      logs: [],
    };
  }
}
