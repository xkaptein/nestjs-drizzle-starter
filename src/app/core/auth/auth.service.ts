import { TResponseData } from '@/common/types';
import { ValidationHelper } from '@/shared/helper/validation.helper';
import { JwtService } from '@/shared/service/jwt.service';
import { ResponseDataService } from '@/shared/service/response-data.service';
import { Injectable } from '@nestjs/common';
import { verify } from 'argon2';
import { UsersRepository } from '../users/users.repository';
import { authSchema, TAuthSchema } from './auth.validation';
import { AuthDto } from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly response: ResponseDataService,
    private readonly validation: ValidationHelper,
    private readonly jwt: JwtService,
  ) {}

  async login(body: AuthDto): Promise<TResponseData> {
    try {
      const validate = await this.validation
        .body(body)
        .schema(authSchema)
        .validate<TAuthSchema>();
      if (!validate.success || !validate.data) {
        return this.response.unprocessableEntity({
          errorMessage: validate.errorMessages,
          message: 'We could not process the request',
        });
      }
      const user = await this.userRepo.findByEmail(validate.data.email);
      if (!user) {
        return this.response.notFound('User not found');
      }
      const passwordMatch = await verify(user.password, validate.data.password);
      if (!passwordMatch) {
        return this.response.unauthorized('Wrong credentials');
      }
      const { password: _, ...restUser } = { ...user };
      const tokenPayload = {
        userId: user.id,
        roleId: user.roleId,
      };
      const accessToken = this.jwt.sign(tokenPayload, { expiresIn: '24h' });
      return this.response.ok({ user: restUser, token: accessToken }, 'Ok');
    } catch (error) {
      return this.response.internalServerError(error);
    }
  }
}
