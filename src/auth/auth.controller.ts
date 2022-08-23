import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserSignInDTO } from '../user/dtos/signin-user.dto';
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

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() user: UserSignInDTO): Promise<{ token: string } | any> {
    return this.authService.signin(user);
  }
}
