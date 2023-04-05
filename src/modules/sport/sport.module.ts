import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sport } from '../sport/sport.enitity';
import { Review } from '../review/review.entity';
import { User } from '../user/user.entity';
import { Class } from '../class/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sport, Review, User, Class])],
  exports: [TypeOrmModule],
})
export class SportModule {}
