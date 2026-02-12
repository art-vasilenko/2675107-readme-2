import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { rabbitConfig } from '@project/shared/config/rabbit';
import notifyConfig from './notification.config';

const ENV_FILE_PATH = 'apps/notification/notify.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [notifyConfig, rabbitConfig],
      envFilePath: ENV_FILE_PATH
    }),
  ]
})
export class NotifyConfigModule {}
