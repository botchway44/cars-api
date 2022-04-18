import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {

  constructor(private userService: UsersService) {

  }

  @Post('signup')
  createUser(@Body() user: CreateUserDTO): Promise<User> {
    console.log(user)
    return this.userService.create(user);
  }

  @Get('user/:id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch('user/:id')
  updateUser(@Param('id') id: string, @Body() user: Partial<User>): Promise<User> {
    return this.userService.update(id, user);
  }

  @Get('users')
  allUsers(): Promise<User[]> {
    return this.userService.all();
  }
}
