import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserDTO } from './dto/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
  @Serialize(UserDTO)
export class UsersController {

  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {

  }

  // @Get('me')
  // async getUsers(@Session() session: any): Promise<User> {
  //   return await this.userService.findOne(session.userId);
  // }

  @Get('me')
  @UseGuards(AuthGuard)
  async getUsers(@CurrentUser() user: User) {
    return user;
  }
  @Get('logout')
  async logout(@Session() session: any): Promise<void> {
    session.userId = null;
    // return await this.userService.findOne(session.userId);
  }


  @Post('signup')
  async createUser(@Body() user: CreateUserDTO, @Session() session: any): Promise<User> {
    const { email, password } = user;
    const new_user = await this.authService.signup(email, password);
    session.userId = new_user.id;
    return new_user;
  }

  @Post('signin')
  async validateUser(@Body() user: CreateUserDTO, @Session() session: any): Promise<User> {
    const { email, password } = user;

    const new_user = await this.authService.signin(email, password);
    session.userId = new_user.id;
    return new_user;
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
