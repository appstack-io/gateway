import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import BottleNeck from 'bottleneck';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';
import { RpcAuthUtils } from '@appstack-io/authnz';
import { RedisService } from '@appstack-io/redis';

@Injectable()
export class RpcGatewayUtils {
  private authUtils: RpcAuthUtils = new RpcAuthUtils();

  constructor(private redis: RedisService) {}

  async intercept(
    key: string,
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<any> {
    const authData = this.authUtils.getAuthData(context);
    if (!this.authUtils.rpcIsExternal(context)) {
      return next.handle();
    }
    try {
      const {
        decoded: { sub: userId },
      } = authData;
      const limit = Number(process.env[key] || 1);
      const limiter = this.redis.getGroupLimiter(
        `${key.toLowerCase()}/${userId}`,
        {
          id: `${key.toLowerCase()}:${limit}`,
          reservoir: limit,
          reservoirRefreshAmount: limit,
          reservoirRefreshInterval: 60000,
          reservoirIncreaseMaximum: limit,
          minTime: 1,
          maxConcurrent: limit,
          highWater: 0,
          strategy: BottleNeck.strategy.BLOCK,
        },
      );
      const timed = async () => {
        const result = await Promise.race([
          limiter.schedule(async () => {
            return 1;
          }),
          new Promise((r) => setTimeout(() => r(0), 100)),
        ]);
        return result;
      };
      if ((await timed()) !== 1) {
        throw new Error('timeout');
      }
      return next.handle();
    } catch (e) {
      if (e.message === 'timeout' || e instanceof BottleNeck.BottleneckError) {
        throw new RpcException({
          message: 'rate limit exceeded',
          code: grpc.status.RESOURCE_EXHAUSTED,
        });
      }
      throw e;
    }
  }
}
