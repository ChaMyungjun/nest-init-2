import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { jwtConstants } from './constants';

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
    const user = await this.userRepository.find();
    const findUser = await user.find((cur) => cur.username === username);
    if (user && findUser.password === pass) {
      const { password, ...result } = findUser;
      return result;
    } else {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: [`등록되지 않은 사용자입니다.`],
        error: 'Forbidden',
      });
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: '1d',
      }),
    };
  }
}
