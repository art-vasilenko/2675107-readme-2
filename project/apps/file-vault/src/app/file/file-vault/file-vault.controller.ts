import 'multer';
import { Express } from 'express';
import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileVaultService } from './file-vault.service';

@Controller('files')
export class FileVaultController {
  constructor(private readonly fileVaultService: FileVaultService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('userId') userId: string
  ) {
    return this.fileVaultService.saveFile(file, userId);
  }
}
