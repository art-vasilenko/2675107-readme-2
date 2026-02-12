import { Module } from '@nestjs/common';
import { FileVaultConfigModule } from '@project/shared/config/file-vault';
import { FileVaultModule } from './file-vault/file-vault.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongooseOptions } from '@project/shared/config/mongo';

@Module({
  imports: [
    MongooseModule.forRootAsync(getMongooseOptions()),
    FileVaultConfigModule,
    FileVaultModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
