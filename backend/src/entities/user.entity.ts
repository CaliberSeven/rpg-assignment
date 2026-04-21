import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { BlogPost } from './blog-post.entity.js';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  username: string;

  @HideField()
  @Column()
  passwordHash: string;

  @HideField()
  @OneToMany(() => BlogPost, (post) => post.author)
  posts: BlogPost[];
}
