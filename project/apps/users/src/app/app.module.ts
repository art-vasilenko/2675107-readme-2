import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { ConfigUsersModule} from "@project/shared/config/users"
import { MongooseModule } from '@nestjs/mongoose';
import { FollowsModule } from './follows/follows.module';
import { NotifyModule } from './notification/notification.module';
import { getMongooseOptions } from '@project/shared/config/mongo';

@Module({
  imports: [AuthenticationModule, UserModule, FollowsModule, ConfigUsersModule, NotifyModule, MongooseModule.forRootAsync(
      getMongooseOptions()
    )],
  controllers: [],
  providers: [],
})
export class AppModule {}
