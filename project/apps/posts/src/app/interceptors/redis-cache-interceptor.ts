import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class RedisCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();

    if (request.method !== 'GET') return undefined;

    const userId = request.user?.id ?? 'anonymous';

    const pathname = new URL(request.originalUrl, 'http://localhost').pathname;

    const detailMatch = pathname.match(/^\/api\/posts\/([a-f0-9-]+)$/);
    if (detailMatch) {
      const postId = detailMatch[1];
      return `post:detail:${postId}`;
    }

    if (pathname === '/api/posts' || pathname === '/api/posts/') {
      const query = new URL(request.originalUrl, 'http://localhost')
        .searchParams;

      for (const key of query.keys()) {
        if (key !== 'page') return undefined;
      }

      const page = query.get('page') ? Number(query.get('page')) : 1;

      const hash = createHash('md5').update(String(page)).digest('hex');

      return `posts:list:${userId}:page:${page}:${hash}`;
    }

    return undefined;
  }
}
