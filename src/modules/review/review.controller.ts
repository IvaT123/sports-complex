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

@Controller('api/sports')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

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
        } else console.log(err);
      }
    }
  }
}
