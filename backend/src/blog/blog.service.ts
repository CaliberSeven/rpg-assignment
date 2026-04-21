import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';
import { BlogPost } from '../entities/blog-post.entity.js';
import { CreatePostInput } from './dto/create-post.input.js';
import { PUB_SUB } from '../pubsub.provider.js';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly postRepo: Repository<BlogPost>,
    @Inject(PUB_SUB)
    private readonly pubSub: PubSub,
  ) {}

  async findAll(): Promise<BlogPost[]> {
    return this.postRepo.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(input: CreatePostInput, userId: number): Promise<BlogPost> {
    const post = this.postRepo.create({
      title: input.title,
      content: input.content,
      author: { id: userId } as any,
    });
    const saved = await this.postRepo.save(post);
    const full = await this.postRepo.findOne({ where: { id: saved.id }, relations: ['author'] });
    await this.pubSub.publish('NEW_BLOG_POST', { newBlogPost: full });
    return full!;
  }
}
