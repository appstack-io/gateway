import { Body, Controller, Post, Req } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Request } from 'express';
import { GatewayBody } from './gatewayPayload';

@Controller('gateway')
export class GatewayController {
  constructor(private service: GatewayService) {}

  @Post('unary')
  async unary(@Req() req: Request, @Body() body: GatewayBody) {
    const metadata = this.service.extractMetadata(req);
    const { service, method, data } = body;
    const result = await this.service.invokeUnary({
      service,
      method,
      data,
      metadata,
    });
    return result;
  }
}
