import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@project/shared/app/types';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreatePostBaseDto {
  @ApiProperty({
    description: 'Type of the post',
    enum: PostType,
    example: PostType.TEXT,
  })
  @IsEnum(PostType)
  type: PostType;


  @ApiProperty({
    description: 'Post tags',
    required: false,
    type: [String],
    example: ['nestjs', 'backend'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
