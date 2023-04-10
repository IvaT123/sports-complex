import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dtos/createreview.dto';
import { ClassService } from '../class/class.service';
import { UserService } from '../user/user.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Review } from './review.entity';

@Controller('api/reviews')
@ApiTags('reviews')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly classService: ClassService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Gets all reviews.' })
  @ApiResponse({ status: 200, description: 'List of reviews.' })
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
  @ApiBody({
    description: 'The review to create.',
    type: Review,
    examples: {
      example: {
        value: {
          rating: 3,
          comment: 'any comment with maximum of 500 characters',
          sportClass: { id: 6 },
        },
      },
    },
  })
  @ApiOperation({
    summary:
      'Allows verified user to create a review for the class specified in the request body.',
  })
  @ApiOkResponse({
    status: 201,
    description: 'Newly created review.',
    type: Review,
  })
  @ApiResponse({
    description: 'List of reviews.',
    type: HttpException,
  })
  async createReview(
    @Body() reviewDto: CreateReviewDto,
  ): Promise<CreateReviewDto | HttpException> {
    try {
      const user = await this.userService.getUserById(reviewDto.user.id);
      const review = await this.reviewService.createReview(
        reviewDto,
        user.isVerified,
      );
      console.log('New review successfully created');
      if ('id' in review) {
        const sportClass = await this.classService.getClassById(
          review.sportClass.id,
        );
        sportClass.averageRating = sportClass.updateAverageRating();
        await this.classService.updateClass(sportClass.id, sportClass);
        return review;
      }
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
