import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { ReadUserDto } from './dtos/readUser.dto';
import { User } from './user.entity';
import { AgeGroup } from '../age-group/ageGroup';

export class UserRepository extends Repository<User> {
  async getAllUsers(): Promise<ReadUserDto[]> {
    const users = await this.find();
    return users;
  }
  async getUserById(id: number): Promise<ReadUserDto> {
    return this.findOneOrFail({
      where: {
        id: id,
      },
      relations: {
        sports: true,
      },
    });
  }
  async createUser(item: CreateUserDto): Promise<CreateUserDto> {
    const user = new CreateUserDto(
      item.id,
      item.name,
      item.age,
      item.email,
      this.calculateAgeGroup(item.age),
      item.sports,
    );
    console.log(user);
    return await this.save(user);
  }
  async updateUser(id: number, item: CreateUserDto): Promise<CreateUserDto> {
    const user = await this.findOneByOrFail({ id: id });
    const updatedUser = await this.save({
      id: user.id,
      name: item.name,
      age: item.age,
      email: item.email,
      sports: item.sports,
    });
    return updatedUser;
  }
  async deleteUser(id: number): Promise<HttpStatus.ACCEPTED> {
    await this.delete(id);
    return HttpStatus.ACCEPTED;
  }
  calculateAgeGroup(age: number): AgeGroup {
    switch (true) {
      case age >= 8 && age <= 12:
        return AgeGroup.Children;
      case age >= 13 && age <= 17:
        return AgeGroup.Youth;
      case age >= 18 && age <= 24:
        return AgeGroup.YoungAdults;
      case age >= 25 && age <= 40:
        return AgeGroup.Adults;
      default:
        throw new Error('Invalid age');
    }
  }
}
