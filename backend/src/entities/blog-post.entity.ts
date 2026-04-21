import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity.js';

@ObjectType()
@Entity()
export class BlogPost {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column('text')
  content: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts, { eager: false })
  author: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
