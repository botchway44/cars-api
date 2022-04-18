import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

  constructor(private userService: UsersService) { }

  async signup(email: string, password: string) {
    const users = await this.userService.find(email);

    if (users.length > 0) {
      throw new BadRequestException('User already exists');
    }

    //gen salt
    const salt = randomBytes(8).toString('hex');
    console.log('Salt', salt);
    //hash passwords
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    console.log('Hash', hash);
    //create user
    const result = salt + '.' + hash.toString('hex');

    // create user
    const user = await this.userService.create({ email, password: result });

    return user;
  }


  async signin(email: string, password: string) {

    //find user with email
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const [salt, storedHash] = user.password.split('.');

    //check password
    const result = (await scrypt(password, salt, 32)) as Buffer;

    if (result.toString('hex') !== storedHash) {
      throw new BadRequestException('Invalid username or password');
    }
    return user;
  }

}