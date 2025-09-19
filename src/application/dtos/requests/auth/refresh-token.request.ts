import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenRequest {
  @ApiProperty({
    description: 'Refresh token used to generate new access token',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsString({ message: 'Refresh token must be a string' })
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsUUID('4', { message: 'Refresh token must be a valid UUID' })
  refreshToken!: string;
}
