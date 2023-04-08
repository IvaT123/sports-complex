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
import { DailyScheduleService } from './dailySchedule.service';
import { DailyScheduleDto } from './dtos/dailySchedule.dto';

@Controller('api/dailySchedules')
export class DailyScheduleController {
  constructor(private readonly dailyScheduleService: DailyScheduleService) {}

  @Get()
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
  @Header('Content-Type', 'appliation/json')
  async createDailySchedule(
    @Body() scheduleDto: DailyScheduleDto,
  ): Promise<DailyScheduleDto | void> {
    try {
      const dailySchedule = await this.dailyScheduleService.createDailySchedule(
        scheduleDto,
      );
      console.log('Successfully created new daily schedule');
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
  async deleteDailySchedule(@Param('id') id: number) {
    try {
      return await this.dailyScheduleService.deleteDailySchedule(id);
    } catch {
      throw idException;
    }
  }
}
