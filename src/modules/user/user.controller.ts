import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { idException } from 'src/exceptions/idException';
import { User } from './user.entity';
import { SportService } from '../sport/sport.service';
import { ClassService } from '../class/class.service';

@Controller('api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly sportService: SportService,
    private readonly classService: ClassService,
  ) {}

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
      throw idException;
    }
  }
  @Post()
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
        }
      }
      throw new HttpException(err.detail, HttpStatus.BAD_REQUEST);
    }
  }
  @Post(':userId/sports/:sportId/enroll')
  async enrollUserInSport(
    @Param('userId') userId: number,
    @Param('sportId') sportId: number,
  ): Promise<HttpStatus.ACCEPTED | HttpException> {
    try {
      const sport = await this.sportService.getSportById(sportId);
      const classes = await this.classService.getClassesBySportId(sportId);
      return await this.userService.enrollUserInSport(userId, sport, classes);
    } catch (err) {
      throw new Error(err);
    }
  }
  @Post(':userId/sports/:sportId/disenroll')
  async disenrollUserFromSport(
    @Param('userId') userId: number,
    @Param('sportId') sportId: number,
  ): Promise<HttpStatus.ACCEPTED> {
    try {
      const sportClasses = await this.classService.getClassesBySportId(sportId);
      return await this.userService.disenrollUserFromSport(
        userId,
        sportId,
        sportClasses.map((sportClass) => sportClass.id),
      );
    } catch (err) {
      throw new Error(err.details);
    }
  }
  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() updateUser: User) {
    try {
      return await this.userService.updateUser(id, updateUser);
    } catch {
      throw idException;
    }
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    try {
      return await this.userService.deleteUser(id);
    } catch {
      throw idException;
    }
  }
}
