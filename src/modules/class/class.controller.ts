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
  Query,
} from '@nestjs/common';
import { idException } from 'src/exceptions/idException';
import { ClassService } from './class.service';
import { CreateClassDto } from './dtos/createClass.dto';
import { Class } from './class.entity';
import { SportService } from '../sport/sport.service';
import { UserService } from '../user/user.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('api/classes')
@ApiTags('classes')
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    private readonly sportService: SportService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Get all classes or only those which satisfy queries passed by user.',
  })
  @ApiOkResponse({
    status: 201,
    description:
      'Returns an array of classes that satisfy queries passed by user, or all classes if no query is specified',
    type: [Class],
  })
  @ApiQuery({
    name: 'sports',
    required: false,
    example: 'Football,Basketball',
    description:
      'Returns classes associated with listed sports, or with a single sport if only one is provided',
  })
  @ApiQuery({
    name: 'duration',
    required: false,
    example: '1:30',
    description: 'Refers to 1 hour and 30 minutes',
  })
  @ApiQuery({
    name: 'ageGroups',
    required: false,
    example: 'Children,Youth',
    description:
      'Returns classes associated with listed age groups, or with a single age group if only one is provided',
  })
  @ApiQuery({
    name: 'dayOfWeek',
    required: false,
    example: 'Saturday',
    description:
      'Returns classes that are scheduled for Saturday. Weekly schedule is not implemented, this endpoint refers to any class that is scheduled for at least one Saturday',
  })
  async getAllClasses(
    @Query('sports') sports?: string,
    @Query('duration') duration?: string,
    @Query('ageGroups') ageGroups?: string,
    @Query('dayOfWeek') dayOfWeek?: string,
  ) {
    try {
      return await this.classService.getAllClasses(
        sports,
        duration,
        ageGroups,
        dayOfWeek,
      );
    } catch {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gets class by id.' })
  @ApiResponse({ status: 200, description: 'Single class by given id.' })
  async getClassById(@Param('id') id: number) {
    try {
      return await this.classService.getClassById(id);
    } catch {
      throw idException;
    }
  }

  @Post()
  @ApiBody({
    description: 'The review to create.',
    type: Class,
    examples: {
      example: {
        value: {
          description: 'Any description between 10 and 500 characters',
          ageGroup: 'Children',
          sport: { id: 2 },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Creates new sport class.' })
  @ApiResponse({ status: 201, description: 'Newly created class.' })
  async createClass(
    @Body() classDto: CreateClassDto,
  ): Promise<CreateClassDto | HttpException> {
    try {
      const sport = await this.sportService.getSportById(classDto.sport.id);
      classDto.duration = sport.classDuration;
      const sportClass = await this.classService.createClass(
        classDto,
        sport.classes,
      );
      if ('id' in sportClass) {
        const updatedClass = await this.classService.getClassById(
          sportClass.id,
        );
        await this.userService.assignClassToUsers(sport.users, updatedClass);
        console.log('Successfully created new class');
      }
      return sportClass;
    } catch (err) {
      for (const key in classDto) {
        if (
          classDto[key as keyof typeof classDto] === undefined &&
          key !== 'id'
        ) {
          throw new HttpException(
            `Information about ${key} is required, but was not provided`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw new Error(err.detail);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updates class by id.' })
  @ApiResponse({ status: 200, description: 'Updated class' })
  async updateClass(@Param('id') id: number, @Body() updateClassDto: Class) {
    try {
      return await this.classService.updateClass(id, updateClassDto);
    } catch {
      throw idException;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes sport by id.' })
  async deleteClass(@Param('id') id: number) {
    try {
      return await this.classService.deleteClass(id);
    } catch {
      throw idException;
    }
  }
}
