import { IsNotEmpty, Min, IsNumber, Max, MaxLength } from 'class-validator';
import { Class } from 'src/modules/class/class.entity';
import { User } from 'src/modules/user/user.entity';

export class CreateReviewDto {
  public readonly id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  public readonly rating: number;

  @MaxLength(500, {
    message: 'Comment must be at most 500 characters long!',
  })
  public readonly comment: string;

  @IsNotEmpty()
  public readonly sportClass: Class;

  @IsNotEmpty()
  public readonly user: User;

  constructor(
    id: number,
    rating: number,
    comment: string,
    sportClass: Class,
    user: User,
  ) {
    this.id = id;
    this.rating = rating;
    this.comment = comment;
    this.sportClass = sportClass;
    this.user = user;
  }
}
