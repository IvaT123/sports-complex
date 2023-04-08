import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailySchedule } from './dailySchedule.entity';
import { DailyScheduleDto } from './dtos/dailySchedule.dto';

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

@Injectable()
export class DailyScheduleService {
  constructor(
    @InjectRepository(DailySchedule)
    private readonly dailyScheduleRepository: Repository<DailySchedule>,
  ) {}
  async getAllDailySchedules(): Promise<DailySchedule[]> {
    return await this.dailyScheduleRepository.find();
  }

  async createDailySchedule(item: DailyScheduleDto): Promise<DailyScheduleDto> {
    const dailySchedule = new DailyScheduleDto(
      item.id,
      this.getDateAndTime(new Date(item.date), item.time),
      this.getDayOfWeek(new Date(item.date)),
      item.sportClass,
    );
    return await this.dailyScheduleRepository.save(dailySchedule);
  }

  async updateDailySchedule(
    id: number,
    item: DailyScheduleDto,
  ): Promise<DailySchedule> {
    const dailySchedule = await this.dailyScheduleRepository.findOneByOrFail({
      id: id,
    });
    const updatedDailySchedule = await this.dailyScheduleRepository.save({
      id: dailySchedule.id,
      date: this.getDateAndTime(new Date(item.date), item.time),
      dayOfWeek: this.getDayOfWeek(new Date(item.date)),
      sportClass: item.sportClass,
    });
    return updatedDailySchedule;
  }
  async deleteDailySchedule(id: number): Promise<HttpStatus.ACCEPTED> {
    const dailySchedule = await this.dailyScheduleRepository.findOneByOrFail({
      id: id,
    });
    if (dailySchedule) {
      await this.dailyScheduleRepository.delete(id);
      return HttpStatus.ACCEPTED;
    }
  }
  getDayOfWeek(date: Date) {
    const dayOfWeekNumber = date.getDay();
    return daysOfWeek[dayOfWeekNumber];
  }
  getDateAndTime(date: Date, time: string): Date {
    if (!/^\d{2}\/\d{2}\/\d{4}?/.test(date.toLocaleString('en-GB'))) {
      throw new BadRequestException('Date must be in format mm/dd/yyyy');
    }
    const [hoursString, minutesString] = time.split(':');
    const hours = parseInt(hoursString);
    const minutes = parseInt(minutesString);
    if (isNaN(hours) || isNaN(minutes)) {
      throw new BadRequestException('Time must be in format HH:MM');
    }
    const now = new Date();
    const userOffset = now.getTimezoneOffset();
    console.log(userOffset);
    const newDate = date;
    newDate.setHours(hours);
    newDate.setMinutes(minutes - userOffset, 0, 0);
    return newDate;
  }
}
