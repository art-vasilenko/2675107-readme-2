import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RedisCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    const isGet = httpAdapter.getRequestMethod(request) === 'GET';
    if (!isGet) return undefined;

    const userId = request.user?.id ?? 'anonymous';
    const url = httpAdapter.getRequestUrl(request);

    return `posts:${userId}:${url}`;
  }
}
