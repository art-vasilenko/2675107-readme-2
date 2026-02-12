import { ConfigService } from '@nestjs/config';
import { ServeStaticModuleOptions, ServeStaticModuleAsyncOptions } from '@nestjs/serve-static';

const SERVE_ROOT = '/static';

export function getServeStaticModuleOptions(): ServeStaticModuleAsyncOptions {
  return {
    useFactory: (configService: ConfigService): ServeStaticModuleOptions[] => {
      const rootPath = configService.get<string>('application.uploadDirectory');

      return [
        {
          rootPath,
          serveRoot: SERVE_ROOT,
          serveStaticOptions: {
            fallthrough: true,
            etag: true,
          },
        },
      ];
    },
    inject: [ConfigService],
  };
}
