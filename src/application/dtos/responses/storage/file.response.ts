import { ApiProperty } from '@nestjs/swagger';

export class FileResponse {
  @ApiProperty({
    description: 'File ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'File name on the server',
    example: 'document_1704067200000.pdf',
  })
  filename!: string;

  @ApiProperty({
    description: 'Original file name from upload',
    example: 'important-document.pdf',
  })
  originalName!: string;

  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf',
  })
  mimeType!: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
  })
  size!: number;

  @ApiProperty({
    description: 'Whether the file is publicly accessible',
    example: false,
  })
  isPublic!: boolean;

  @ApiProperty({
    description: 'File access URL',
    example: 'https://example.com/files/550e8400-e29b-41d4-a716-446655440000',
  })
  url!: string;

  @ApiProperty({
    description: 'File upload timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'File last update timestamp',
    example: '2024-01-01T12:00:00.000Z',
  })
  updatedAt!: Date;

  constructor(data?: Partial<FileResponse>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

// Legacy alias for backward compatibility
export type FileResponseDto = FileResponse;
