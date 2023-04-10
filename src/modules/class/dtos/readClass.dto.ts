import { AgeGroup } from 'src/modules/ageGroup/ageGroup';
import { DailySchedule } from 'src/modules/dailySchedule.ts/dailySchedule.entity';
import { Review } from 'src/modules/review/review.entity';
import { Sport } from 'src/modules/sport/sport.enitity';
import { User } from 'src/modules/user/user.entity';

export class ReadClassDto {
  constructor(
    public readonly id: number,
    public readonly description: string,
    public readonly schedule: DailySchedule[],
    public duration: string,
    public readonly ageGroup: AgeGroup,
    public readonly sport: Sport,
    public readonly users: User[],
    public readonly reviews: Review[],
    public averageRating: number,
  ) {}
}
