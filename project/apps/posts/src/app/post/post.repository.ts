import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientService } from '@project/shared/posts/models';
import { PostEntity } from './post.entity';
import { PostMeta, PostStatus, PostType } from '@project/shared/app/types';
import { BasePrismaRepository } from '@project/shared/core';
import { CreatePostDto } from './dto/create-post.dto';
import { MAX_POST_LIMIT, POST_NOT_FOUND } from './post.constant';
import { PostQueryDto } from './dto/post-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostRepository extends BasePrismaRepository<PostEntity, PostMeta> {
  constructor(protected readonly client: PrismaClientService) {
    super(client, PostEntity.fromObject);
  }

  public async findById(id: string): Promise<PostEntity> {
    const document = await this.client.post.findFirst({
      where: { id },
      include: {
        photo: true,
        text: true,
        video: true,
        quote: true,
        link: true,
      },
    });

    if (!document) {
      throw new NotFoundException(POST_NOT_FOUND);
    }

    const typeToDataMap = {
      [PostType.PHOTO]: document.photo,
      [PostType.TEXT]: document.text,
      [PostType.VIDEO]: document.video,
      [PostType.QUOTE]: document.quote,
      [PostType.LINK]: document.link,
    };

    const data = typeToDataMap[document.type] ?? null;

    return this.createEntityFromDocument({
      ...document,
      data,
      type: document.type as PostType,
      status: document.status as PostStatus,
    });
  }

  public async find(query: PostQueryDto): Promise<{
    posts: PostEntity[];
    totalItems: number;
  }> {
    const {
      page = 1,
      limit = MAX_POST_LIMIT,
      sort = 'publishedAt',
      type,
      tag,
    } = query;

    const where = {
      status: PostStatus.PUBLISHED,
      ...(type && { type }),
      ...(tag && { tags: { has: tag } }),
    };

    const orderBy =
      sort === 'comments'
        ? { commentsCount: Prisma.SortOrder.desc }
        : { publishedAt: Prisma.SortOrder.desc };

    const [documents, totalItems] = await Promise.all([
      this.client.post.findMany({
        where,
        orderBy,
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.client.post.count({ where }),
    ]);

    const posts = documents.map((doc) =>
      this.createEntityFromDocument({
        ...doc,
        type: doc.type as PostType,
        status: doc.status as PostStatus,
      })
    );
    return { posts, totalItems };
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.post.delete({
      where: {
        id,
      },
    });
  }

  public async update(
    id: string,
    data: Partial<PostEntity>
  ): Promise<PostEntity> {
    const updatedCategory = await this.client.post.update({
      where: { id },
      data,
    });

    return this.createEntityFromDocument({
      ...updatedCategory,
      type: updatedCategory.type as PostType,
      status: updatedCategory.status as PostStatus,
    });
  }

  public async createPost(
    dto: CreatePostDto,
    authorId: string
  ): Promise<PostEntity> {
    return this.client.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          type: dto.type,
          status: PostStatus.PUBLISHED,
          authorId,
          tags: dto.tags ?? [],
          publishedAt: new Date(),
        },
      });

      switch (dto.type) {
        case PostType.VIDEO:
          await tx.postVideo.create({
            data: {
              postId: post.id,
              title: dto.title,
              videoUrl: dto.videoUrl,
            },
          });
          break;

        case PostType.TEXT:
          await tx.postText.create({
            data: {
              postId: post.id,
              title: dto.title,
              announcement: dto.announcement,
              content: dto.content,
            },
          });
          break;

        case PostType.QUOTE:
          await tx.postQuote.create({
            data: {
              postId: post.id,
              quote: dto.quote,
              quoteAuthor: dto.quoteAuthor,
            },
          });
          break;

        case PostType.PHOTO:
          await tx.postPhoto.create({
            data: {
              postId: post.id,
              photoUrl: dto.photoUrl,
            },
          });
          break;

        case PostType.LINK:
          await tx.postLink.create({
            data: {
              postId: post.id,
              linkUrl: dto.linkUrl,
              linkDescription: dto.linkDescription,
            },
          });
          break;
      }

      return this.createEntityFromDocument({
        ...post,
        type: post.type as PostType,
        status: post.status as PostStatus,
      });
    });
  }

  public async findDrafts(authorId: string): Promise<PostEntity[]> {
    const documents = await this.client.post.findMany({
      where: {
        status: PostStatus.DRAFT,
        authorId,
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
      take: MAX_POST_LIMIT,
    });

    return documents.map((doc) =>
      this.createEntityFromDocument({
        ...doc,
        type: doc.type as PostType,
        status: doc.status as PostStatus,
      })
    );
  }
}
