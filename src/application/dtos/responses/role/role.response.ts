import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponse } from '../permission/permission.response';

export class RoleDetailResponse {
  @ApiProperty({
    description: 'Role ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Role name',
    example: 'admin',
  })
  name!: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Administrator role with full system access',
  })
  description!: string;

  @ApiProperty({
    description: 'Whether this is the default role for new users',
    example: false,
  })
  isDefault!: boolean;
  @ApiProperty({
    description: 'Permissions assigned to this role',
    type: [PermissionResponse],
  })
  permissions!: PermissionResponse[];

  @ApiProperty({
    description: 'Role creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Role last update timestamp',
    example: '2024-01-01T12:00:00.000Z',
  })
  updatedAt!: Date;
}
