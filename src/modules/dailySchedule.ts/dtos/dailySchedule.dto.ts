import { IsNotEmpty, IsString } from 'class-validator';
import { Class } from 'src/modules/class/class.entity';

export class DailyScheduleDto {
  public readonly id: number;

  @IsNotEmpty()
  public readonly date: Date;

  @IsString()
  public readonly time: string;

  public readonly dayOfWeek: string;

  public readonly sportClass: Class;

  constructor(id: number, date: Date, dayOfWeek: string, sportClass: Class) {
    this.id = id;
    this.date = date;
    this.dayOfWeek = dayOfWeek;
    this.sportClass = sportClass;
  }
}
