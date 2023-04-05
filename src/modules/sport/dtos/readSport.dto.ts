import { AgeGroup } from 'src/modules/age-group/ageGroup';
import { Review } from 'src/modules/review/review.entity';
import { User } from 'src/modules/user/user.entity';

export class ReadSportDto {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly classDuration: string,
    public readonly ageGroups: AgeGroup[],
    public readonly users: User[],
    public readonly reviews: Review[],
  ) {}
}
