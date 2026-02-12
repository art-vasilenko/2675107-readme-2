import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static'
import { getServeStaticModuleOptions } from "@project/shared/config/file-vault"
import { FileVaultService } from './file-vault.service';
import { FileVaultController } from './file-vault.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { FileVaultModel, FileVaultSchema } from './file-vault.model';

@Module({
  imports: [
    ServeStaticModule.forRootAsync(getServeStaticModuleOptions()),
    MongooseModule.forFeature([
      { name: FileVaultModel.name, schema: FileVaultSchema }
    ])
  ],
  providers: [FileVaultService],
  controllers: [FileVaultController],
})
export class FileVaultModule {}
