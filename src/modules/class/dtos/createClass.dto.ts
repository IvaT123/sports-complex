import { Length, IsNotEmpty } from 'class-validator';
import { AgeGroup } from 'src/modules/ageGroup/ageGroup';
import { Sport } from 'src/modules/sport/sport.enitity';

export class CreateClassDto {
  public readonly id: number;

  @Length(10, 500, {
    message:
      'Description length not supported: description should be between $constraint1 and $constraint2 characters long',
  })
  public readonly description: string;

  public duration: string;

  @IsNotEmpty()
  public readonly ageGroup: AgeGroup;

  @IsNotEmpty()
  public readonly sport: Sport;

  constructor(
    id: number,
    description: string,
    duration: string,
    ageGroup: AgeGroup,
    sport: Sport,
  ) {
    this.id = id;
    this.description = description;
    this.duration = duration;
    this.ageGroup = ageGroup;
    this.sport = sport;
  }
}
