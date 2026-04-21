import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../entities/user.entity.js';

@ObjectType()
export class AuthPayload {
  @Field()
  token: string;

  @Field(() => User)
  user: User;
}
