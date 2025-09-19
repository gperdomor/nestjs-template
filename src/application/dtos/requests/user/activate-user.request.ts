import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ActivateUserRequest {
  @ApiProperty({
    description: 'User activation status (true to activate, false to deactivate)',
    example: true,
  })
  @IsBoolean({ message: 'Active status must be a boolean value' })
  @IsNotEmpty({ message: 'Active status is required' })
  active!: boolean;
}
