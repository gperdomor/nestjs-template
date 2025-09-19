import { SetMetadata } from '@nestjs/common';
import { ResourceType, ActionType } from '@core/value-objects/resource-action.vo';

/**
 * Decorator to specify resource and action for permission checking
 * Used with the enhanced PermissionsGuard
 *
 * @param resource - The resource being accessed (ResourceType enum)
 * @param action - The action being performed (ActionType enum)
 */
export const RequiresResourceAction =
  (resource: ResourceType, action: ActionType) =>
  (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata('resource', resource)(target, propertyKey, descriptor);
    SetMetadata('action', action)(target, propertyKey, descriptor);
  };
