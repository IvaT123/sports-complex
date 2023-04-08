import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../review/review.entity';
import { Class } from '../class/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Class])],
  exports: [TypeOrmModule],
})
export class ReviewModule {}
