import { User } from 'src/modules/user/user.entity';

export class ReadSportDto {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly classDuration: string,
    public readonly users: User[],
  ) {}
}
