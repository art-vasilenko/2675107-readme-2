import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, ValidateIf, IsNotEmpty, IsOptional } from 'class-validator';
import { PostType } from '@project/shared/app/types';
import { CreatePostBaseDto } from './create-post-base.dto';

export class CreatePostDto extends CreatePostBaseDto {

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.type === PostType.VIDEO || o.type === PostType.TEXT)
  @IsString()
  @IsNotEmpty()
  public title?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.type === PostType.VIDEO)
  @IsUrl()
  public videoUrl?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.type === PostType.TEXT)
  @IsString()
  public announcement?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.type === PostType.TEXT)
  @IsString()
  public content?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.type === PostType.QUOTE)
  @IsString()
  public quote?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.type === PostType.QUOTE)
  @IsString()
  public quoteAuthor?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.type === PostType.PHOTO)
  @IsString()
  public photoUrl?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.type === PostType.LINK)
  @IsString()
  public linkUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public linkDescription?: string;
}
