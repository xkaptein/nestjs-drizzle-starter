import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { type FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post()
  async login(@Body() body: AuthDto, @Res() res: FastifyReply) {
    const result = await this.service.login(body);
    return res.status(result.statusCode).send(result);
  }
}
