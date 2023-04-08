import { Class } from 'src/modules/class/class.entity';

export class ReadReviewDto {
  constructor(
    public readonly id: number,
    public readonly rating: number,
    public readonly comment: string,
    public readonly sportClass: Class,
  ) {}
}
