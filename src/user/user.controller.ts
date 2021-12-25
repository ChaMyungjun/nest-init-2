import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  getAllUser() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getOneUser(@Param('id') userId: number) {
    return this.usersService.findOne(userId);
  }

  @Post()
  createUser(@Body() req) {
    return this.usersService.createUser(req);
  }

  @Delete(':id')
  removeUser(@Param('id') userId: number) {
    return this.usersService.remove(userId);
  }

  @Patch(':id')
  updateUser(@Param('id') userId: number, @Body() req) {
    // console.log("asdfasdf",req)
    return this.usersService.update(userId, req);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    console.log(
      req.res.setHeader(
        'Set-Cookie',
        (await this.usersService.login(req.user)).access_token,
      ),
    );
    return this.usersService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getUserMe(@Request() req) {
    console.log(req);
    // return req.user;
  }
}
