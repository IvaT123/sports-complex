import { Length, IsString, IsNotEmpty } from 'class-validator';

export class CreateSportDto {
  public readonly id: number;

  @IsNotEmpty()
  @Length(2, 50, {
    message:
      'Sport name should be between $constraint1 and $constraint2 characters long, instead $value was provided',
  })
  public readonly name: string;

  @IsString()
  public readonly classDuration: string;

  constructor(id: number, name: string, classDuration: string) {
    this.id = id;
    this.name = name;
    this.classDuration = classDuration;
  }
}
