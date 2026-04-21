import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from '../entities/blog-post.entity.js';
import { BlogService } from './blog.service.js';
import { BlogResolver } from './blog.resolver.js';
import { pubSubProvider } from '../pubsub.provider.js';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost])],
  providers: [BlogService, BlogResolver, pubSubProvider],
})
export class BlogModule {}
