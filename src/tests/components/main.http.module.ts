import { Module } from '@nestjs/common';
import { IdentityServicesModule } from '@appstack-io/identity';
import { GatewayModule } from '../../gateway.module';

const imports = [IdentityServicesModule, GatewayModule];

export { imports };

@Module({
  imports,
})
export class MainHttpModule {
  static __filename = __filename;
}
