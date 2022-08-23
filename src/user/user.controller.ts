import { Controller, Get, Param } from '@nestjs/common';
import { UserInterface } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserInterface> {
    return this.userService.findById(id);
  }
}
