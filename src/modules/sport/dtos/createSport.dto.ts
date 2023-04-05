import { Length, IsString, IsNotEmpty } from 'class-validator';
import { AgeGroup } from 'src/modules/age-group/ageGroup';

export class CreateSportDto {
  public readonly id: number;

  @IsNotEmpty()
  @Length(10, 50, {
    message:
      'Name should be between $constraint1 and $constraint2 characters long, instead $value was provided',
  })
  public readonly name: string;

  @Length(10, 500, {
    message:
      'Description length not supported: description should be between $constraint1 and $constraint2 characters long',
  })
  public readonly description: string;

  @IsString()
  public readonly classDuration: string;

  public ageGroups: AgeGroup[];

  constructor(
    id: number,
    name: string,
    description: string,
    classDuration: string,
    ageGroups: AgeGroup[],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.classDuration = classDuration;
    this.ageGroups = ageGroups;
  }
}
