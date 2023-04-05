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
import { CreateSportDto } from './dtos/createSport.dto';
import { SportService } from './sport.service';

@Controller('api/sports')
export class SportController {
  constructor(private readonly sportService: SportService) {}

  @Get()
  async getAllSports() {
    try {
      return await this.sportService.getAllSports();
    } catch {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get(':id')
  async getSportById(@Param('id') id: number) {
    try {
      return await this.sportService.getSportById(id);
    } catch {
      throw new HttpException(
        'Sport with given id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }
  @Post()
  @Header('Content-Type', 'appliation/json')
  async createSport(
    @Body() sportDto: CreateSportDto,
  ): Promise<CreateSportDto | void> {
    try {
      const sport = await this.sportService.createSport(sportDto);
      console.log('Successfully created new user');
      return sport;
    } catch (err) {
      for (const key in sportDto) {
        if (
          sportDto[key as keyof typeof sportDto] === undefined &&
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
  async updateSport(
    @Param('id') id: number,
    @Body() updateSportDto: CreateSportDto,
  ) {
    try {
      return await this.sportService.updateSport(id, updateSportDto);
    } catch {
      throw new HttpException(
        'Sport with given id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }
  @Delete(':id')
  async deleteSport(@Param('id') id: number) {
    try {
      return await this.sportService.deleteSport(id);
    } catch {
      throw new HttpException(
        'Sport with given id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
