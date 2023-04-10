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
import { idException } from 'src/exceptions/idException';
import { DailyScheduleService } from './dailySchedule.service';
import { DailyScheduleDto } from './dtos/dailySchedule.dto';
import { ClassService } from '../class/class.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DailySchedule } from './dailySchedule.entity';

@Controller('api/dailySchedules')
@ApiTags('dailySchedules')
export class DailyScheduleController {
  constructor(
    private readonly dailyScheduleService: DailyScheduleService,
    private readonly classService: ClassService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Gets all daily schedules.' })
  @ApiResponse({ status: 200, description: 'List of daily schedules.' })
  async getAllDailySchedules() {
    try {
      return await this.dailyScheduleService.getAllDailySchedules();
    } catch {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiBody({
    description: 'The review to create.',
    type: DailySchedule,
    examples: {
      example: {
        value: {
          date: '04.08.2023.',
          time: '9:00',
          sportClass: { id: 6 },
        },
      },
    },
  })
  @ApiOperation({
    summary:
      'Creates new schedule unit if the date specified is not already taken for specific age group. New schedule gets assigned to class specified in the request body',
  })
  @ApiOkResponse({
    status: 201,
    description: 'Newly created review.',
    type: DailySchedule,
  })
  async createDailySchedule(
    @Body() scheduleDto: DailyScheduleDto,
  ): Promise<DailyScheduleDto | HttpException> {
    try {
      const sportClass = await this.classService.getClassById(
        scheduleDto.sportClass.id,
      );
      const dailySchedule = await this.dailyScheduleService.createDailySchedule(
        scheduleDto,
        sportClass,
      );
      return dailySchedule;
    } catch (err) {
      for (const key in scheduleDto) {
        if (
          scheduleDto[key as keyof typeof scheduleDto] === undefined &&
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
  @ApiOperation({
    summary: 'Updates schedule unit',
  })
  @ApiResponse({ status: 200, description: 'Updated schedule unit' })
  async updateDailySchedule(
    @Param('id') id: number,
    @Body() updatedDailySchedule: DailyScheduleDto,
  ) {
    try {
      return await this.dailyScheduleService.updateDailySchedule(
        id,
        updatedDailySchedule,
      );
    } catch {
      throw idException;
    }
  }
  @Delete(':id')
  @ApiOperation({
    summary: 'Deletes schedule unit',
  })
  async deleteDailySchedule(@Param('id') id: number) {
    try {
      return await this.dailyScheduleService.deleteDailySchedule(id);
    } catch {
      throw idException;
    }
  }
}
