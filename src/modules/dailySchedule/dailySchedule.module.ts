import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailySchedule } from './dailySchedule.entity';
import { Class } from '../class/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailySchedule, Class])],
  exports: [TypeOrmModule],
})
export class DailyScheduleModule {}
