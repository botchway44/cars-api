import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';


@Injectable()
export class UsersService {

  private userRepository: Repository<User>;

  constructor(
    private readonly connection: Connection,
  ) {
    this.userRepository = this.connection.getRepository(User);
  }


  create(userDTO: CreateUserDTO): Promise<User> {
    const user = this.userRepository.create({ email: userDTO.email, password: userDTO.password });
    return this.userRepository.save(user);
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id: id } });
  }



  find(email: string) {
    return this.userRepository.find({ where: { email: email } });
  }

  async update(id: string, attributes: Partial<User>) {

    const user = await this.findOne(id);
    if (user) {
      Object.assign(user, attributes);
    } else {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.save(user);
  }

  async remove(id: string) {

    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.remove(user);
  }

  all() {
    return this.userRepository.find();
  }
}
