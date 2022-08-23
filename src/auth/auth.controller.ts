import { Body, Controller, Post } from '@nestjs/common';
import { UserSignUpDTO } from '../user/dtos/signup-user.dto';
import { UserInterface } from '../user/user.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() user: UserSignUpDTO): Promise<UserInterface | any> {
    return this.authService.signup(user);
  }
}
