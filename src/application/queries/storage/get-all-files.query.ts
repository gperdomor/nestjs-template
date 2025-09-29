import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { StorageService } from '@core/services/storage.service';
import { FileMapper } from '../../mappers/file.mapper';
import { FileResponse } from '@application/dtos';

export interface IGetAllFilesResult {
  files: FileResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetAllFilesQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}

@QueryHandler(GetAllFilesQuery)
export class GetAllFilesQueryHandler
  implements IQueryHandler<GetAllFilesQuery, IGetAllFilesResult>
{
  constructor(
    private readonly storageService: StorageService,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(query: GetAllFilesQuery): Promise<IGetAllFilesResult> {
    const { page, limit } = query;
    const result = await this.storageService.getAllFiles(page, limit);

    return {
      files: await this.fileMapper.toResponseDtoList(result.files),
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };
  }
}
