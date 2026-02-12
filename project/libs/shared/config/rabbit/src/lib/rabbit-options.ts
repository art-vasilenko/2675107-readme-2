import { ConfigService } from '@nestjs/config';
import { getRabbitMQConnectionString } from '@project/shared/helpers';

export function getRabbitMQOptions() {
  return {
    useFactory: async (config: ConfigService) => ({
      exchanges: [
        {
          name: config.get<string>(`rabbit.exchange`),
          type: 'direct'
        }
      ],
      uri:getRabbitMQConnectionString({
        host: config.getOrThrow<string>(`rabbit.host`),
        password: config.getOrThrow<string>(`rabbit.password`),
        user: config.getOrThrow<string>(`rabbit.user`),
        port: config.getOrThrow<string>(`rabbit.port`),
      }),
      connectionInitOptions: { wait: true },
      enableControllerDiscovery: true,
    }),
    inject: [ConfigService]
  }
}
