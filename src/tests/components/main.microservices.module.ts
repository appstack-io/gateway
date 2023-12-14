import { Module } from '@nestjs/common';
import { PermissionModule } from '@appstack-io/permissions';
import { IdentityServicesModule } from '@appstack-io/identity';

const imports = [PermissionModule, IdentityServicesModule];

export { imports };

@Module({
  imports,
})
export class MainMicroservicesModule {
  static __filename = __filename;
}
