import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PrismaClientModule } from '@project/shared/posts/models';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { ConfigService } from '@nestjs/config';
import Keyv from 'keyv';

@Module({
  imports: [
    PrismaClientModule,
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const host = config.getOrThrow<string>('redis.host');
        const port = config.getOrThrow<number>('redis.port');

        const uri = `redis://${host}:${port}`;

        const keyv = new Keyv({
          store: new KeyvRedis(uri),
          ttl: 60000,
        });

        return {
          stores: [keyv],
        };
      },
    }),
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
