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
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';

@Controller('api/users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly sportService: SportService,
    private readonly classService: ClassService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Gets all users.' })
  @ApiResponse({ status: 200, description: 'List of users.' })
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
  @ApiOperation({ summary: 'Gets user by id.' })
  @ApiResponse({ status: 200, description: 'Single user by given id.' })
  async getUserById(@Param('id') id: number) {
    try {
      return await this.userService.getUserById(id);
    } catch {
      throw idException;
    }
  }

  @Post()
  @ApiOperation({
    summary:
      'Creates new user and sends verification email to specified email address that must be unique.',
  })
  @ApiOkResponse({
    status: 201,
    description: 'Newly created user.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    type: HttpException,
  })
  @ApiBody({
    description: 'The user to create.',
    type: User,
    examples: {
      example: {
        value: {
          name: 'Full name',
          age: 30,
          email: 'something@somemail.com',
        },
      },
    },
  })
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
  @ApiOperation({
    summary:
      'Allows verified users to enroll in chosen sport as long as they are not already enrolled in maximum number of sports allowed or if their age group class has empty spaces left.',
  })
  async enrollUserInSport(
    @Param('userId') userId: number,
    @Param('sportId') sportId: number,
  ): Promise<HttpStatus.ACCEPTED | HttpException> {
    try {
      const sport = await this.sportService.getSportById(sportId);
      const classes = await this.classService.getClassesBySportId(sportId);
      return await this.userService.enrollUserInSport(userId, sport, classes);
    } catch (err) {
      throw new Error(err.details);
    }
  }

  @Post(':userId/sports/:sportId/disenroll')
  @ApiOperation({
    summary:
      'Allows users to disenroll from a chosen sport as long as they were previously enrolled.',
  })
  async disenrollUserFromSport(
    @Param('userId') userId: number,
    @Param('sportId') sportId: number,
  ): Promise<HttpStatus.ACCEPTED | HttpException> {
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
  @ApiOperation({ summary: 'Updates user by id.' })
  @ApiResponse({ status: 200, description: 'Updated user by given id.' })
  async updateUser(@Param('id') id: number, @Body() updateUser: User) {
    try {
      return await this.userService.updateUser(id, updateUser);
    } catch {
      throw idException;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes user by id.' })
  async deleteUser(@Param('id') id: number) {
    try {
      return await this.userService.deleteUser(id);
    } catch {
      throw idException;
    }
  }
}
