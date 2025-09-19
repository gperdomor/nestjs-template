import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StorageService, IStorageFile } from '@core/services/storage.service';
import { FileMapper } from '../../mappers/file.mapper';
import { FileResponse } from '@application/dtos';

export class UploadFileCommand {
  constructor(
    public readonly file: IStorageFile,
    public readonly userId?: string,
  ) {}
}

@CommandHandler(UploadFileCommand)
export class UploadFileCommandHandler implements ICommandHandler<UploadFileCommand, FileResponse> {
  constructor(
    private readonly storageService: StorageService,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(command: UploadFileCommand): Promise<FileResponse> {
    const { file, userId } = command;

    const fileEntity = await this.storageService.uploadFile(file, userId);

    return this.fileMapper.toResponseDto(fileEntity);
  }
}
