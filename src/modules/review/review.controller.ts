import {
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dtos/createreview.dto';
import { ClassService } from '../class/class.service';

@Controller('api/reviews')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly classService: ClassService,
  ) {}

  @Get()
  async getAllReviews() {
    try {
      return await this.reviewService.getAllReviews();
    } catch {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post()
  @Header('Content-Type', 'appliation/json')
  async createReview(
    @Body() reviewDto: CreateReviewDto,
  ): Promise<CreateReviewDto | void> {
    try {
      const review = await this.reviewService.createReview(reviewDto);
      console.log('New review successfully created');
      const sportClass = await this.classService.getClassById(
        review.sportClass.id,
      );
      sportClass.averageRating = sportClass.updateAverageRating();
      await this.classService.updateClass(sportClass.id, sportClass);

      return review;
    } catch (err) {
      for (const key in reviewDto) {
        if (
          reviewDto[key as keyof typeof reviewDto] === undefined &&
          key !== 'id'
        ) {
          throw new HttpException(
            `Information about ${key} is required, but was not provided`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw new Error(err.detail);
    }
  }
}
