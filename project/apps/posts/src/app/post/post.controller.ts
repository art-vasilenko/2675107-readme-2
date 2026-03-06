import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { fillDto } from '@project/shared/helpers';
import { PostRdo } from './rdo/post.rdo';
import { PostQueryDto } from './dto/post-query.dto';
import { RedisCacheInterceptor } from '../interceptors/redis-cache-interceptor';

@ApiTags('posts')
@UseInterceptors(RedisCacheInterceptor)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiResponse({ status: 201 })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() dto: CreatePostDto) {
    const post = await this.postService.create(dto, 'user-id-1');
    return fillDto(PostRdo, post.toPOJO());
  }

  @Get(':id')
  public async show(@Param('id') id: string) {
    const post = await this.postService.findById(id);
    return post.toPOJO();
  }

  @Get()
  public async index(@Query() query: PostQueryDto) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const result = await this.postService.findAllPublished(query);

    return {
      posts: result.posts.map((p) => fillDto(PostRdo, p.toPOJO())),
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      totalItems: result.totalItems,
      itemsPerPage: result.itemsPerPage,
    };
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreatePostDto>
  ) {
    const post = await this.postService.update(id, dto, 'user-id-1');
    return fillDto(PostRdo, post.toPOJO());
  }

  @Delete(':id')
  public async delete(@Param('id') id: string) {
    await this.postService.delete(id, 'user-id-1');
    return { message: 'Post deleted successfully' };
  }

  @Post(':id/repost')
  public async repost(@Param('id') id: string) {
    const post = await this.postService.repost(id, 'user-id-1');
    return fillDto(PostRdo, post.toPOJO());
  }

  @Get('drafts')
  public async drafts() {
    const userId = 'user-id-1';
    const posts = await this.postService.findDrafts(userId);
    return posts.map((p) => fillDto(PostRdo, p.toPOJO()));
  }
}
