import { IsNumber, Length, IsString, Max, Min } from 'class-validator';
import { AgeGroup } from 'src/modules/ageGroup/ageGroup';
import { Class } from 'src/modules/class/class.entity';
import { Sport } from 'src/modules/sport/sport.enitity';

export class CreateUserDto {
  public readonly id: number;

  @Length(5, 50, {
    message:
      'Name should be between $constraint1 and $constraint2 characters long, instead $value was provided',
  })
  public readonly name: string;

  @IsNumber()
  @Min(8, {
    message: 'Minimum age allowed to enroll in a class is 8',
  })
  @Max(40, {
    message: 'Maximum age allowed to enroll in a class is 40',
  })
  public readonly age: number;

  @IsString()
  public readonly email: string;

  public readonly verificationToken: string;

  public isVerified: boolean;

  public readonly ageGroup: AgeGroup;

  public readonly sports: Sport[];

  public readonly classes: Class[];

  constructor(
    id: number,
    name: string,
    age: number,
    email: string,
    verificationToken: string,
    isVerified: boolean,
    ageGroup: AgeGroup,
    sports: Sport[],
    classes: Class[],
  ) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.email = email;
    this.verificationToken = verificationToken;
    this.isVerified = isVerified;
    this.ageGroup = ageGroup;
    this.sports = sports;
    this.classes = classes;
  }
}
