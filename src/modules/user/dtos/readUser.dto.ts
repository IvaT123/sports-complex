import { AgeGroup } from 'src/modules/ageGroup/ageGroup';
import { Sport } from 'src/modules/sport/sport.enitity';

export class ReadUserDto {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly age: number,
    public readonly email: string,
    public readonly ageGroup: AgeGroup,
    public readonly sports: Sport[],
  ) {}
}
