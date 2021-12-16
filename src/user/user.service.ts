import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
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
    let newUser: User;
    if (req.password === req.passwordConfirm) {
      newUser = this.userRepository.create({
        id: req.id,
        email: req.email,
        username: req.username,
        password: req.password,
      });
    }

    await this.userRepository.insert(newUser);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async update(id: number, req): Promise<User> {
    const userToUpdate: User = await this.findOne(id);
    userToUpdate.username = req.username;
    return await this.userRepository.save(userToUpdate);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
