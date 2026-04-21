import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service.js';
import { AuthPayload } from './models/auth-payload.model.js';
import { AuthInput } from './dto/auth.input.js';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async register(@Args('input') input: AuthInput): Promise<AuthPayload> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: AuthInput): Promise<AuthPayload> {
    return this.authService.login(input);
  }
}
