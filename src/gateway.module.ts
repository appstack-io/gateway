import { Module } from '@nestjs/common';
import { GatewayService } from './gateway/gateway.service';
import { GatewayController } from './gateway/gateway.controller';

@Module({
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
