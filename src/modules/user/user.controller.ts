import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    try {
      return await this.userService.getAllUsers();
    } catch {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    try {
      return await this.userService.getUserById(id);
    } catch {
      throw new HttpException(
        'User with given id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }
  @Post()
  @Header('Content-Type', 'appliation/json')
  async createUser(
    @Body() userDto: CreateUserDto,
  ): Promise<CreateUserDto | void> {
    try {
      const user = await this.userService.createUser(userDto);
      console.log('Successfully created new user');
      return user;
    } catch (err) {
      for (const key in userDto) {
        if (
          userDto[key as keyof typeof userDto] === undefined &&
          key !== 'id'
        ) {
          throw new HttpException(
            `Information about ${key} is required, but was not provided`,
            HttpStatus.BAD_REQUEST,
          );
        } else console.log(err);
      }
    }
  }
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: CreateUserDto,
  ) {
    try {
      return await this.userService.updateUser(id, updateUserDto);
    } catch {
      throw new HttpException(
        'User with given id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    try {
      return await this.userService.deleteUser(id);
    } catch {
      throw new HttpException(
        'User with given id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
