import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { ReadReviewDto } from './dtos/readReview.dto';
import { CreateReviewDto } from './dtos/createreview.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}
  async getAllReviews(): Promise<ReadReviewDto[]> {
    return await this.reviewRepository.find();
  }

  async createReview(
    item: CreateReviewDto,
    isVerified: boolean,
  ): Promise<CreateReviewDto | HttpException> {
    if (isVerified) {
      const review = new CreateReviewDto(
        item.id,
        item.rating,
        item.comment,
        item.sportClass,
        item.user,
      );
      return await this.reviewRepository.save(review);
    } else
      return new HttpException(
        'User must be verified to leave a review',
        HttpStatus.FORBIDDEN,
      );
  }
}
