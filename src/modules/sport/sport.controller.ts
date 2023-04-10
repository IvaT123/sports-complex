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
import { CreateSportDto } from './dtos/createSport.dto';
import { SportService } from './sport.service';
import { Sport } from './sport.enitity';
import { idException } from 'src/exceptions/idException';
import { ClassService } from '../class/class.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';

@Controller('api/sports')
@ApiTags('sports')
export class SportController {
  constructor(
    private readonly sportService: SportService,
    private readonly classServce: ClassService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Gets all sports.' })
  @ApiResponse({ status: 200, description: 'List of sports.' })
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
  @ApiOperation({ summary: 'Gets sport by id.' })
  @ApiResponse({ status: 200, description: 'Single sport by given id.' })
  async getSportById(@Param('id') id: number) {
    try {
      return await this.sportService.getSportById(id);
    } catch {
      throw idException;
    }
  }

  @Post()
  @ApiBody({
    description: 'The sport to create.',
    type: Sport,
    examples: {
      example: {
        value: {
          name: 'Football',
          classDuration: '2:00',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Creates new sport with unique name constraint.' })
  @ApiOkResponse({
    status: 201,
    description: 'Newly created sport.',
    type: Sport,
  })
  @ApiResponse({ status: 400, type: HttpException })
  async createSport(
    @Body() sportDto: CreateSportDto,
  ): Promise<CreateSportDto | void> {
    try {
      const sport = await this.sportService.createSport(sportDto);
      console.log('Successfully created new sport');
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
        }
      }
      throw new HttpException(err.detail, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updates sport by id.' })
  @ApiResponse({ status: 200, description: 'Updated sport' })
  async updateSport(@Param('id') id: number, @Body() updatedSport: Sport) {
    try {
      const sport = await this.sportService.updateSport(id, updatedSport);
      const sportClasses = await this.classServce.getClassesBySportId(sport.id);
      for (let i = 0; i < sportClasses.length; i++) {
        const sportClass = sportClasses[i];
        sportClass.duration = sport.classDuration;
        await this.classServce.updateClass(sportClass.id, sportClass);
      }
      return sport;
    } catch {
      throw idException;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes sport by id.' })
  async deleteSport(@Param('id') id: number) {
    try {
      return await this.sportService.deleteSport(id);
    } catch {
      throw idException;
    }
  }
}
