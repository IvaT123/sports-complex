import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sport } from '../sport/sport.enitity';
import { Review } from '../review/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Sport])],
  exports: [TypeOrmModule],
})
export class ReviewModule {}
