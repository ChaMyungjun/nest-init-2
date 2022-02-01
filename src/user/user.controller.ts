import { Controller, Delete, Get, Param } from "@nestjs/common";
import { Public } from "src/skip-auth.decorator";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param() id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Delete(":id")
  async remove(@Param() id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
