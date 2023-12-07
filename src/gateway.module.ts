import { Module } from '@nestjs/common';
import { RedisModule } from '@appstack-io/redis';
import { RpcRateLimitReadInterceptor } from './utils/rpcRateLimitRead.interceptor';
import { RpcRateLimitWriteInterceptor } from './utils/rpcRateLimitWrite.interceptor';
import { RpcGatewayUtils } from './utils/rpcGatewayUtils.service';
import { GatewayService } from './gateway/gateway.service';
import { GatewayController } from './gateway/gateway.controller';

@Module({
  imports: [RedisModule],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    RpcRateLimitReadInterceptor,
    RpcRateLimitWriteInterceptor,
    RpcGatewayUtils,
  ],
  exports: [
    RpcRateLimitReadInterceptor,
    RpcRateLimitWriteInterceptor,
    RpcGatewayUtils,
  ],
})
export class GatewayModule {}
