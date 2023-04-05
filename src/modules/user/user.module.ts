import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Sport } from '../sport/sport.enitity';
import { Review } from '../review/review.entity';
import { Class } from '../class/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Sport, Review, Class])],
  exports: [TypeOrmModule],
})
export class UserModule {}
