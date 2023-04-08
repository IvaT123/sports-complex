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
import { idException } from 'src/exceptions/idException';
import { ClassService } from './class.service';
import { CreateClassDto } from './dtos/createClass.dto';
import { Class } from './class.entity';
import { SportService } from '../sport/sport.service';

@Controller('api/classes')
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    private readonly sportService: SportService,
  ) {}

  @Get()
  async getAllClasses() {
    try {
      return await this.classService.getAllClasses();
    } catch {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get(':id')
  async getClassById(@Param('id') id: number) {
    try {
      return await this.classService.getClassById(id);
    } catch {
      throw idException;
    }
  }
  @Post()
  @Header('Content-Type', 'appliation/json')
  async createClass(
    @Body() classDto: CreateClassDto,
  ): Promise<CreateClassDto | void> {
    try {
      const sport = await this.sportService.getSportById(classDto.sport.id);
      classDto.duration = sport.classDuration;
      const sportClass = await this.classService.createClass(classDto);
      console.log('Successfully created new class');
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
      throw idException;
    }
  }
  @Put(':id')
  async updateClass(@Param('id') id: number, @Body() updateClassDto: Class) {
    try {
      return await this.classService.updateClass(id, updateClassDto);
    } catch {
      throw idException;
    }
  }
  @Delete(':id')
  async deleteClass(@Param('id') id: number) {
    try {
      return await this.classService.deleteClass(id);
    } catch {
      throw idException;
    }
  }
}
