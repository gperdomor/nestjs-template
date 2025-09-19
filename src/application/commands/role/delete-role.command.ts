import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RoleService } from '@core/services/role.service';

export class DeleteRoleCommand {
  constructor(
    public readonly id: string,
    public readonly deleterId?: string, // ID of the user performing the deletion
  ) {}
}

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleCommandHandler implements ICommandHandler<DeleteRoleCommand, boolean> {
  constructor(private readonly roleService: RoleService) {}

  async execute(command: DeleteRoleCommand): Promise<boolean> {
    const { id, deleterId } = command;

    return this.roleService.deleteRole(id, deleterId);
  }
}
