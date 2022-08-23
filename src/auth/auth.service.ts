import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserSignInDTO } from 'src/user/dtos/signin-user.dto';
import { UserSignUpDTO } from 'src/user/dtos/signup-user.dto';
import { UserInterface } from 'src/user/user.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hashSync(password, 12);
  }

  async signup(user: Readonly<UserSignUpDTO>): Promise<UserInterface | any> {
    const { name, email, password } = user;

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) return 'Email taken';

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.create(name, email, hashedPassword);

    return this.userService._getUserInterface(newUser);
  }
}
