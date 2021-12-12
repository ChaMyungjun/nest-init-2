import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(userId: number): Promise<User> {
    const user: User = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException(`${userId} not found`);
    }
    return user;
  }

  async createUser(req) {
    const newUser: User = this.userRepository.create({
      id: req.id,
      email: req.email,
      nickname: req.nickname,
      age: req.age,
    });
    await this.userRepository.insert(newUser);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async update(id: number, req): Promise<User> {
    const userToUpdate: User = await this.findOne(id);
    userToUpdate.nickname = req.nickname;
    return await this.userRepository.save(userToUpdate);
  }
}
