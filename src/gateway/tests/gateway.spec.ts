import { shutdownComponents } from '@appstack-io/main';
import {
  isE2E,
  login,
  runMain,
  setupArangoDb,
  useHost,
  usePorts,
} from '@appstack-io/tests';
import { GatewayBody } from '../gatewayPayload';
import axios from 'axios';
import { MainModule } from './main.module';

describe('Gateway', () => {
  let ports: {
    protoInternal: number;
    proto: number;
    http: number;
    httpInternal: number;
    workers: number;
    ws: number;
  };
  let host: any;
  beforeAll(async () => {
    await setupArangoDb();
    ports = await usePorts();
    host = useHost();
    if (!isE2E()) await runMain({ publicMicroservicesModule: MainModule });
  });

  afterAll(async () => {
    if (!isE2E()) await shutdownComponents();
  });

  test('User: FindOne', async () => {
    // Arrange
    const { accessToken, userId } = await login(ports);
    const payload: GatewayBody = {
      service: 'UserService',
      method: 'findOne',
      data: { id: userId },
    };

    // Act
    const result = await axios.post(
      `http://${host}:${ports.http}/gateway/unary`,
      payload,
      {
        headers: {
          Cookie: `${process.env.COOKIE_NAME}=${accessToken}`,
        },
      },
    );

    // Assert
    expect(result.data.id).toEqual(userId);
  });
});
