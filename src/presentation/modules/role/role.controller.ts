import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

// Guards & Decorators
import { PermissionsGuard } from '@presentation/guards/permissions.guard';
import { RequiresResourceAction } from '@shared/decorators/resource-action.decorator';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { IJwtPayload, CreateRoleRequest, UpdateRoleRequest } from '@application/dtos';
import { ResourceType, ActionType } from '@core/value-objects/resource-action.vo';

// DTOs

// Queries
import { GetRolesQuery } from '@application/queries/role/get-roles.query';
import { GetRoleQuery } from '@application/queries/role/get-role.query';

// Commands
import { CreateRoleCommand } from '@application/commands/role/create-role.command';
import { UpdateRoleCommand } from '@application/commands/role/update-role.command';
import { DeleteRoleCommand } from '@application/commands/role/delete-role.command';
import { AssignPermissionCommand } from '@application/commands/role/assign-permission.command';
import { RemovePermissionCommand } from '@application/commands/role/remove-permission.command';

@ApiTags('roles')
@Controller('roles')
@UseGuards(PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class RoleController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @RequiresResourceAction(ResourceType.ROLE, ActionType.READ)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all roles (Requires role:read permission)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns a list of all roles' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient permissions' })
  async getAllRoles() {
    return this.queryBus.execute(new GetRolesQuery());
  }

  @Get(':id')
  @RequiresResourceAction(ResourceType.ROLE, ActionType.READ)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get role by ID (Requires role:read permission)' })
  @ApiParam({ name: 'id', description: 'Role ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns role information' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient permissions' })
  async getRoleById(@Param('id') id: string) {
    return this.queryBus.execute(new GetRoleQuery(id));
  }

  @Post()
  @RequiresResourceAction(ResourceType.ROLE, ActionType.CREATE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new role (Requires role:create permission)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Role created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have required permission',
  })
  async createRole(@Body() createRoleDto: CreateRoleRequest) {
    return this.commandBus.execute(
      new CreateRoleCommand(
        createRoleDto.name,
        createRoleDto.description,
        createRoleDto.isDefault,
        createRoleDto.permissionIds,
      ),
    );
  }

  @Put(':id')
  @RequiresResourceAction(ResourceType.ROLE, ActionType.UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update role by ID (Requires role:update permission)' })
  @ApiParam({ name: 'id', description: 'Role ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have required permission',
  })
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleRequest) {
    return this.commandBus.execute(
      new UpdateRoleCommand(
        id,
        updateRoleDto.name,
        updateRoleDto.description,
        updateRoleDto.isDefault,
      ),
    );
  }

  @Delete(':id')
  @RequiresResourceAction(ResourceType.ROLE, ActionType.DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete role by ID (Requires role:delete permission)' })
  @ApiParam({ name: 'id', description: 'Role ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have required permission',
  })
  async deleteRole(@Param('id') id: string, @CurrentUser() currentUser: IJwtPayload) {
    await this.commandBus.execute(new DeleteRoleCommand(id, currentUser.sub));

    return { message: 'Role deleted successfully' };
  }

  @Post(':roleId/permissions/:permissionId')
  @RequiresResourceAction(ResourceType.ROLE, ActionType.UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign permission to role (Requires role:update permission)' })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'permissionId',
    description: 'Permission ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission assigned to role successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role or permission not found' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have required permission',
  })
  async assignPermissionToRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.commandBus.execute(new AssignPermissionCommand(roleId, permissionId));
  }

  @Delete(':roleId/permissions/:permissionId')
  @RequiresResourceAction(ResourceType.ROLE, ActionType.UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove permission from role (Requires role:update permission)' })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'permissionId',
    description: 'Permission ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permission removed from role successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role or permission not found' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have required permission',
  })
  async removePermissionFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.commandBus.execute(new RemovePermissionCommand(roleId, permissionId));
  }
}
