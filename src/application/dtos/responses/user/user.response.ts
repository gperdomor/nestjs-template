import { ApiProperty } from '@nestjs/swagger';
import { UserRoleResponse } from '../auth/auth.response';

export class UserRoleDetailResponse extends UserRoleResponse {
  @ApiProperty({
    description: 'Role description',
    example: 'Administrator role with full access',
  })
  description!: string;

  @ApiProperty({
    description: 'Whether this is the default role for new users',
    example: false,
  })
  isDefault!: boolean;
}

export class UserBaseResponse {
  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName!: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName!: string;

  @ApiProperty({
    description: 'Whether user email is verified',
    example: true,
    required: false,
  })
  emailVerified?: boolean;
}

export class UserDetailResponse extends UserBaseResponse {
  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Whether two-factor authentication is enabled',
    example: false,
  })
  otpEnabled!: boolean;

  @ApiProperty({
    description: 'Last login timestamp',
    example: '2024-01-01T12:00:00.000Z',
    required: false,
  })
  lastLoginAt?: Date;

  @ApiProperty({
    description: 'User roles with details',
    type: [UserRoleDetailResponse],
  })
  roles!: UserRoleDetailResponse[];

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last account update timestamp',
    example: '2024-01-01T12:00:00.000Z',
  })
  updatedAt!: Date;
}
