import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '@core/entities/permission.entity';

export class PermissionResponse {
  @ApiProperty({
    description: 'Permission unique identifier',
    example: 'user:read',
  })
  id!: string;

  @ApiProperty({
    description: 'Permission name',
    example: 'user:read',
  })
  name!: string;

  @ApiProperty({
    description: 'Resource name',
    example: 'user',
  })
  resource!: string;

  @ApiProperty({
    description: 'Action name',
    example: 'read',
  })
  action!: string;

  @ApiProperty({
    description: 'Permission description',
    example: 'Allows reading user information',
  })
  description!: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  updatedAt?: Date;

  static fromEntity(permission: Permission): PermissionResponse {
    return {
      id: permission.id.getValue(),
      name: permission.getPermissionName(),
      resource: permission.getResource(),
      action: permission.getAction(),
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }
}
