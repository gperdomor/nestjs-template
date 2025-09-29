import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { IPermissionRepository } from '@core/repositories/permission.repository.interface';
import { PERMISSION_REPOSITORY } from '@shared/constants/tokens';
import { PermissionResponse } from '@application/dtos';

export class GetPermissionsQuery implements IQuery {}

@Injectable()
@QueryHandler(GetPermissionsQuery)
export class GetPermissionsQueryHandler implements IQueryHandler<GetPermissionsQuery> {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(): Promise<PermissionResponse[]> {
    const permissions = await this.permissionRepository.findAll();

    return permissions.map(permission => PermissionResponse.fromEntity(permission));
  }
}
