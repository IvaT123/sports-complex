import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Class } from './class.entity';
import { Sport } from '../sport/sport.enitity';
import { Review } from '../review/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Sport, User, Review])],
  exports: [TypeOrmModule],
})
export class ClassModule {}
