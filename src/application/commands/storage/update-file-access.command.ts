import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { StorageService } from '@core/services/storage.service';
import { FileMapper } from '../../mappers/file.mapper';
import { FileResponse } from '@application/dtos';

export class UpdateFileAccessCommand {
  constructor(
    public readonly fileId: string,
    public readonly isPublic: boolean,
    public readonly userId?: string,
  ) {}
}

@CommandHandler(UpdateFileAccessCommand)
export class UpdateFileAccessCommandHandler
  implements ICommandHandler<UpdateFileAccessCommand, FileResponse>
{
  constructor(
    private readonly storageService: StorageService,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(command: UpdateFileAccessCommand): Promise<FileResponse> {
    const { fileId, isPublic, userId } = command;

    const file = await this.storageService.getFileById(fileId);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check if the user has permission to update the file
    if (userId && file.userId && file.userId !== userId) {
      throw new UnauthorizedException('You do not have permission to update this file');
    }

    const updatedFile = isPublic
      ? await this.storageService.makeFilePublic(fileId)
      : await this.storageService.makeFilePrivate(fileId);

    if (!updatedFile) {
      throw new Error('File not found after update');
    }

    return this.fileMapper.toResponseDto(updatedFile);
  }
}
