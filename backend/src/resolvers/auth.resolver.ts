import { Arg, Mutation, Resolver } from 'type-graphql'
import { LoginInput, RegistroInput } from '../dtos/input/auth.input.js'
import { LoginOutput, RegistroOutput } from '../dtos/output/auth.output.js'
import { AuthService } from '../services/auth.service.js'

@Resolver()
export class AuthResolver {
  private authService = new AuthService()

  @Mutation(() => LoginOutput)
  async login(
    @Arg('data', () => LoginInput) data: LoginInput
  ): Promise<LoginOutput> {
    return this.authService.login(data)
  }

  @Mutation(() => RegistroOutput)
  async registro(
    @Arg('data', () => RegistroInput) data: RegistroInput
  ): Promise<RegistroOutput> {
    return this.authService.registro(data)
  }
}
