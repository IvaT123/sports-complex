import { IsNotEmpty, Min, IsNumber, Max, MaxLength } from 'class-validator';
import { Sport } from 'src/modules/sport/sport.enitity';

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
  public readonly sport: Sport;

  constructor(id: number, rating: number, comment: string, sport: Sport) {
    this.id = id;
    this.rating = rating;
    this.comment = comment;
    this.sport = sport;
  }
}
