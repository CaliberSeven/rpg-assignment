import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { UseGuards, Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { BlogPost } from '../entities/blog-post.entity.js';
import { BlogService } from './blog.service.js';
import { CreatePostInput } from './dto/create-post.input.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { PUB_SUB } from '../pubsub.provider.js';

@Resolver(() => BlogPost)
export class BlogResolver {
  constructor(
    private readonly blogService: BlogService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => [BlogPost])
  async posts(): Promise<BlogPost[]> {
    return this.blogService.findAll();
  }

  @Mutation(() => BlogPost)
  @UseGuards(JwtAuthGuard)
  async createPost(
    @CurrentUser() user: { id: number },
    @Args('input') input: CreatePostInput,
  ): Promise<BlogPost> {
    return this.blogService.create(input, user.id);
  }

  @Subscription(() => BlogPost, { name: 'newBlogPost' })
  newBlogPost() {
    return this.pubSub.asyncIterableIterator('NEW_BLOG_POST');
  }
}
