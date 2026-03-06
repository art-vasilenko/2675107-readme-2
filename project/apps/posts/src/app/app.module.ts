import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { ConfigModule } from '@nestjs/config';
import { redisConfig } from '@project/shared/config/redis';

const ENV_POSTS_FILE_PATH = 'apps/posts/posts.env';

@Module({
  imports: [
    PostModule,
    CommentsModule,
    LikesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [redisConfig],
      envFilePath: ENV_POSTS_FILE_PATH,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
