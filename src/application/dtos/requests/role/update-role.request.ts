import { IsOptional, IsString, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRoleRequest {
  @ApiPropertyOptional({
    description: 'Role name (unique identifier)',
    example: 'moderator',
    minLength: 3,
    maxLength: 50,
  })
  @IsString({ message: 'Role name must be a string' })
  @MinLength(3, { message: 'Role name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Role name cannot exceed 50 characters' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Role description explaining its purpose and permissions',
    example: 'Moderator role with content management access',
    minLength: 10,
    maxLength: 200,
  })
  @IsString({ message: 'Role description must be a string' })
  @MinLength(10, { message: 'Role description must be at least 10 characters long' })
  @MaxLength(200, { message: 'Role description cannot exceed 200 characters' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether this role should be assigned to new users by default',
    example: false,
  })
  @IsBoolean({ message: 'isDefault must be a boolean value' })
  @IsOptional()
  isDefault?: boolean;
}
