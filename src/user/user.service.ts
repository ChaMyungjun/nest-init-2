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
    console.log(req);

    const newUser: User = this.userRepository.create({
      id: req.id,
      intra_id: req.intra_id,
      nickname: req.nickname,
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
