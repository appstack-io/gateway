import { createChannel, createClient } from 'nice-grpc';
import {
  PermissionServiceClient,
  PermissionServiceDefinition,
} from '@appstack-io/client';
import { shutdownComponents } from '@appstack-io/main';
import { v4 as uuid } from 'uuid';
import {
  isE2E,
  runMain,
  setupArangoDb,
  useHost,
  usePorts,
} from '@appstack-io/tests';
import { MainModule } from './main.module';

describe('Permission', () => {
  let client: PermissionServiceClient;

  beforeAll(async () => {
    await setupArangoDb();
    const ports = await usePorts();
    const host = useHost();
    const channel = createChannel(`${host}:${ports.protoInternal}`);
    client = createClient(PermissionServiceDefinition, channel);
    if (!isE2E()) await runMain({ privateMicroservicesModule: MainModule });
  });

  afterAll(async () => {
    if (!isE2E()) await shutdownComponents();
  });

  test('CreateOne + FindOne', async () => {
    // Arrange
    const input = {
      entity: uuid(),
      entityId: uuid(),
      permittedEntity: uuid(),
      permittedEntityId: uuid(),
      action: '*',
    };

    // Act
    const created = await client.createOne(input);
    const found = await client.findOne({ id: created.id });

    // Assert
    expect(found).toEqual(created);
  });

  test('FindWhere', async () => {
    // Arrange
    const input = {
      entity: uuid(),
      entityId: uuid(),
      permittedEntity: uuid(),
      permittedEntityId: uuid(),
      action: '*',
    };

    // Act
    const created = await client.createOne(input);
    const found = await client.findWhere(input);

    // Assert
    expect(found).toEqual(created);
  });

  test('FindWhereMany', async () => {
    // Arrange
    const input = {
      entity: uuid(),
      entityId: uuid(),
      permittedEntity: uuid(),
      permittedEntityId: uuid(),
      action: '*',
    };
    const created = await client.createOne(input);

    // Act
    const found = await client.findWhereMany({
      ...input,
      permittedEntityIds: [input.permittedEntityId],
    });

    // Assert
    expect(found).toEqual({ permissions: [created] });
  });

  test('RemoveOne', async () => {
    // Arrange
    const input = {
      entity: uuid(),
      entityId: uuid(),
      permittedEntity: uuid(),
      permittedEntityId: uuid(),
      action: '*',
    };
    const created = await client.createOne(input);

    // Act
    await client.removeOne({ id: created.id });

    // Assert
    await expect(client.findOne({ id: created.id })).rejects.toThrow(
      'not found',
    );
  });

  test('RemoveWhere', async () => {
    // Arrange
    const input = {
      entity: uuid(),
      entityId: uuid(),
      permittedEntity: uuid(),
      permittedEntityId: uuid(),
      action: '*',
    };
    await client.createOne(input);

    // Act
    await client.removeWhere(input);

    // Assert
    await expect(client.findWhere(input)).rejects.toThrow('not found');
  });

  test('RemoveWhereMany', async () => {
    // Arrange
    const input = {
      entity: uuid(),
      entityId: uuid(),
      permittedEntity: uuid(),
      permittedEntityId: uuid(),
      action: '*',
    };
    await client.createOne(input);

    // Act
    await client.removeWhereMany({
      ...input,
      permittedEntityIds: [input.permittedEntityId],
    });

    // Assert
    await expect(client.findWhere(input)).rejects.toThrow('not found');
  });

  test('FindByPermitted', async () => {
    // Arrange
    const input = {
      entity: uuid(),
      entityId: uuid(),
      permittedEntity: uuid(),
      permittedEntityId: uuid(),
      action: '*',
    };
    for (let i = 0; i < 7; i++) {
      await client.createOne({
        ...input,
        entity: uuid(),
        entityId: uuid(),
      });
    }

    // Act
    const all = await client.findByPermitted({
      filter: {
        permittedEntity: input.permittedEntity,
        permittedEntityId: input.permittedEntityId,
      },
      opts: { limit: 10 },
    });

    // Assert
    expect(all.results.length).toEqual(7);
  });
});
