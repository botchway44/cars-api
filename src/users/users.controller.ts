import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserDTO } from './dto/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';

@Controller('auth')
  @Serialize(UserDTO)
export class UsersController {

  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {

  }

  @Post('signup')
  createUser(@Body() user: CreateUserDTO): Promise<User> {
    const { email, password } = user;
    return this.authService.signup(email, password);
  }

  @Post('signin')
  validateUser(@Body() user: CreateUserDTO): Promise<User> {
    const { email, password } = user;
    return this.authService.signin(email, password);
  }


  @Get('user/:id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch('user/:id')
  updateUser(@Param('id') id: string, @Body() user: UpdateUserDTO): Promise<User> {
    return this.userService.update(id, user);
  }

  @Delete('user/:id')
  deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }


  @Get('users')
  allUsers(): Promise<User[]> {
    return this.userService.all();
  }
}
