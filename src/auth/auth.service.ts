import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    if (existingUser)
      throw new HttpException(
        'An account with the email already exists',
        HttpStatus.CONFLICT,
      );

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.create(name, email, hashedPassword);

    return this.userService._getUserInterface(newUser);
  }

  async signin(user: UserSignInDTO): Promise<{ token: string } | null> {
    const { email, password } = user;

    const existingUser = await this.userService.findByEmail(email);

    if (!existingUser)
      throw new HttpException('Credentials invalid', HttpStatus.UNAUTHORIZED);

    const validPassword = bcrypt.compare(password, existingUser.password);

    if (!validPassword)
      throw new HttpException('Credentials invalid', HttpStatus.UNAUTHORIZED);

    const validUser = this.userService._getUserInterface(existingUser);

    const jwt = await this.jwtService.signAsync({ validUser });

    return { token: jwt };
  }
  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (error) {
      throw new HttpException('Invalid JWT', HttpStatus.UNAUTHORIZED);
    }
  }
}
