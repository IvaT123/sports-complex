import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { ReadUserDto } from './dtos/readUser.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AgeGroup } from '../age-group/ageGroup';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getAllUsers(): Promise<ReadUserDto[]> {
    return await this.userRepository.find();
  }
  async getUserById(id: number): Promise<ReadUserDto> {
    return await this.userRepository.findOneOrFail({
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
    return await this.userRepository.save(user);
  }
  async updateUser(id: number, item: CreateUserDto): Promise<CreateUserDto> {
    const user = await this.userRepository.findOneByOrFail({ id: id });
    const updatedUser = await this.userRepository.save({
      id: user.id,
      name: item.name,
      age: item.age,
      email: item.email,
      sports: item.sports,
    });
    return updatedUser;
  }
  async deleteUser(id: number): Promise<HttpStatus.ACCEPTED> {
    await this.userRepository.delete(id);
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
