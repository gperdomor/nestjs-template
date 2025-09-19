import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFileAccessRequest {
  @ApiProperty({
    description: 'Whether the file should be publicly accessible (true) or private (false)',
    example: true,
  })
  @IsBoolean({ message: 'isPublic must be a boolean value' })
  @IsNotEmpty({ message: 'isPublic is required' })
  isPublic!: boolean;
}
