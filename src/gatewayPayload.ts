import { Metadata } from 'nice-grpc';

export type GatewayPayload = {
  service: string;
  method: string;
  data: any;
  metadata: Metadata;
};

export type GatewayBody = {
  service: string;
  method: string;
  data: any;
};
