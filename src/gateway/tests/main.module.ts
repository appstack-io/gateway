import { Module } from '@nestjs/common';
import { PermissionModule } from '../permission.module';

const imports = [PermissionModule];

export { imports };

@Module({
  imports,
})
export class MainModule {
  static __filename = __filename;
}
