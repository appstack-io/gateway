import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RpcGatewayUtils } from './rpcGatewayUtils.service';

@Injectable()
export class RpcRateLimitWriteInterceptor implements NestInterceptor {
  constructor(private utils: RpcGatewayUtils) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    return await this.utils.intercept('WRITE_RPM_LIMIT', context, next);
  }
}
