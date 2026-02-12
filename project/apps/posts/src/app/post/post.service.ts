import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './post.entity';
import { CANNOT_DELETE_POST, CANNOT_EDIT_POST, MAX_POST_LIMIT, POST_NOT_FOUND } from './post.constant';
import { PostQueryDto } from './dto/post-query.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  public async create(dto: CreatePostDto, authorId: string) {
    return this.postRepository.createPost(dto, authorId);
  }

  public async findById(id: string) {
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException(POST_NOT_FOUND);
    return post;
  }

  public async findAllPublished(query: PostQueryDto) {
    const { page = 1, limit = MAX_POST_LIMIT } = query

    const { posts, totalItems } = await this.postRepository.find(query);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      posts, totalPages, currentPage: page,
      totalItems, itemsPerPage: limit
    };
  }

  public async update(id: string, dto: Partial<CreatePostDto>, userId: string) {
    const post = await this.findById(id);
    if (post.authorId !== userId) {
      throw new NotFoundException(CANNOT_EDIT_POST);
    }
    const updateData = {
      ...dto,
      publishedAt: new Date()
    }

    post.populate(updateData);
    return this.postRepository.update(id);
  }

  public async delete(id: string, userId: string) {
    const post = await this.findById(id);
    if (post.authorId !== userId) {
      throw new NotFoundException(CANNOT_DELETE_POST);
    }

    await this.postRepository.deleteById(id);
  }

  public async repost(postId: string, userId: string) {
    const original = await this.findById(postId);
    const repost = new PostEntity({
      ...original.toPOJO(),
      id: undefined,
      authorId: userId,
      originalAuthorId: original.authorId,
      originalPostId: original.id,
      isRepost: true,
      publishedAt: new Date(),
    });
    return this.postRepository.save(repost);
  }

  public async findByAuthor(authorId: string) {
    return this.postRepository.find({ authorId: authorId});
  }

  public async findDrafts(userId: string) {
    return this.postRepository.findDrafts(userId);
  }
}
