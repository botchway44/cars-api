import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';


@Injectable()
export class AuthService {

  constructor(private userService: UsersService) { }

  async signup(email: string, password: string) {
    const users = await this.userService.find(email);

    if (users.length > 0) {
      throw new BadRequestException('User already exists');
    }
  }


  signin(email: string, password: string) {
    // return this.userService.findOne(email, password);
  }

}