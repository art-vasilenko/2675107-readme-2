import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSubscriberModule } from './email-subscriber/email-subscriber.module';
import {NotifyConfigModule} from '@project/shared/config/notification'
import { getMongooseOptions } from '@project/shared/config/mongo';


@Module({
  imports: [
    MongooseModule.forRootAsync(getMongooseOptions()),
    NotifyConfigModule,
    EmailSubscriberModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
