import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ description: 'valid email', example: 'johndoe@mail.com' })
  email!: string;
  @ApiProperty({ minLength: 8 })
  password!: string;
}
