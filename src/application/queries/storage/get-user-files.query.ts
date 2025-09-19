import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { StorageService } from '@core/services/storage.service';
import { FileMapper } from '../../mappers/file.mapper';
import { FileResponse } from '@application/dtos';

export class GetUserFilesQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserFilesQuery)
export class GetUserFilesQueryHandler implements IQueryHandler<GetUserFilesQuery, FileResponse[]> {
  constructor(
    private readonly storageService: StorageService,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(query: GetUserFilesQuery): Promise<FileResponse[]> {
    const { userId } = query;
    const files = await this.storageService.getFilesByUserId(userId);

    return this.fileMapper.toResponseDtoList(files);
  }
}
