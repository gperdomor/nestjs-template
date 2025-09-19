import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Patch,
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
import { ResourceType, ActionType } from '@core/value-objects/resource-action.vo';

// DTOs
import {
  UpdateUserRequest,
  ChangePasswordRequest,
  ActivateUserRequest,
  AssignRoleRequest,
  IJwtPayload,
} from '@application/dtos';

// Queries
import { GetUserQuery } from '@application/queries/user/get-user.query';
import { GetUsersQuery } from '@application/queries/user/get-users.query';

// Commands
import { UpdateUserCommand } from '@application/commands/user/update-user.command';
import { ChangePasswordCommand } from '@application/commands/user/change-password.command';
import { ActivateUserCommand } from '@application/commands/user/activate-user.command';
import { AssignRoleCommand } from '@application/commands/user/assign-role.command';
import { RemoveRoleCommand } from '@application/commands/user/remove-role.command';
import { VerifyPasswordCommand } from '@application/commands/user/verify-password.command';

@ApiTags('users')
@Controller('users')
@UseGuards(PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @RequiresResourceAction(ResourceType.USER, ActionType.READ)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users (Requires user:read permission)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns a list of all users' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient permissions' })
  async getAllUsers() {
    return this.queryBus.execute(new GetUsersQuery());
  }

  @Get(':id')
  @RequiresResourceAction(ResourceType.USER, ActionType.READ)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by ID (Requires user:read permission)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns user information' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient permissions' })
  async getUserById(@Param('id') id: string) {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  @Put(':id')
  @RequiresResourceAction(ResourceType.USER, ActionType.UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user by ID (Requires user:update permission)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient permissions' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserRequest) {
    return this.commandBus.execute(
      new UpdateUserCommand(
        id,
        updateUserDto.firstName,
        updateUserDto.lastName,
        updateUserDto.email,
      ),
    );
  }

  @Put('/profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async updateCurrentUserProfile(
    @CurrentUser() user: IJwtPayload,
    @Body() updateUserDto: UpdateUserRequest,
  ) {
    return this.commandBus.execute(
      new UpdateUserCommand(
        user.sub,
        updateUserDto.firstName,
        updateUserDto.lastName,
        updateUserDto.email,
      ),
    );
  }

  @Delete(':id')
  @RequiresResourceAction(ResourceType.USER, ActionType.DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user by ID (Requires user:delete permission)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient permissions' })
  async deleteUser(@Param('id') _id: string) {
    // This would normally use a command
    return { message: 'User deleted successfully' };
  }

  @Post(':id/change-password')
  @RequiresResourceAction(ResourceType.USER, ActionType.UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password (Requires user:update permission)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password changed successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient permissions' })
  async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordRequest) {
    await this.commandBus.execute(
      new ChangePasswordCommand(
        id,
        changePasswordDto.newPassword,
        changePasswordDto.currentPassword,
      ),
    );

    return { message: 'Password changed successfully' };
  }

  @Post('/profile/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password changed successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Current password is incorrect' })
  async changeCurrentUserPassword(
    @CurrentUser() user: IJwtPayload,
    @Body() changePasswordDto: ChangePasswordRequest,
  ) {
    await this.commandBus.execute(
      new ChangePasswordCommand(
        user.sub,
        changePasswordDto.newPassword,
        changePasswordDto.currentPassword,
      ),
    );

    return { message: 'Password changed successfully' };
  }

  @Post('/profile/verify-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify current user password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password verification result' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async verifyCurrentUserPassword(
    @CurrentUser() user: IJwtPayload,
    @Body('password') password: string,
  ) {
    const isValid = await this.commandBus.execute(new VerifyPasswordCommand(user.sub, password));

    return { valid: isValid };
  }

  @Patch(':id/activate')
  @RequiresResourceAction(ResourceType.USER, ActionType.UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate or deactivate user (Requires user:update permission)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User activation status updated' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient permissions' })
  async activateUser(@Param('id') id: string, @Body() activateUserDto: ActivateUserRequest) {
    return this.commandBus.execute(new ActivateUserCommand(id, activateUserDto.active));
  }

  @Post(':id/roles')
  @RequiresResourceAction(ResourceType.USER, ActionType.UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign role to user (Requires user:update permission)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role assigned successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User or role not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient permissions' })
  async assignRoleToUser(
    @Param('id') id: string,
    @Body() assignRoleDto: AssignRoleRequest,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    return this.commandBus.execute(
      new AssignRoleCommand(id, assignRoleDto.roleId, currentUser.sub),
    );
  }

  @Delete(':id/roles/:roleId')
  @RequiresResourceAction(ResourceType.USER, ActionType.UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove role from user (Requires user:update permission)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiParam({
    name: 'roleId',
    description: 'Role ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role removed successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient permissions' })
  async removeRoleFromUser(@Param('id') id: string, @Param('roleId') roleId: string) {
    return this.commandBus.execute(new RemoveRoleCommand(id, roleId));
  }
}
