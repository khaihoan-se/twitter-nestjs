import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // ---------------------------------------
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/follow')
  follow(@Param('id') id: string, @Req() req: Request) {
    return this.usersService.follow(id, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/unfollow')
  unfollow(@Param('id') id: string, @Req() req: Request) {
    return this.usersService.unfollow(id, req);
  }
}
