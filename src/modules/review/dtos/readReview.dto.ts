import { Sport } from 'src/modules/sport/sport.enitity';

export class ReadReviewDto {
  constructor(
    public readonly id: number,
    public readonly rating: number,
    public readonly comment: string,
    public readonly sport: Sport,
  ) {}
}
