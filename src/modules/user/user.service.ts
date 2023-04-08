import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { ReadUserDto } from './dtos/readUser.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AgeGroup } from '../ageGroup/ageGroup';
import { Sport } from '../sport/sport.enitity';
import { idException } from 'src/exceptions/idException';

@Injectable()
export class UserService {
  private readonly maxSportsQuantity: number = 2;
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
  async enrollUserInSport(
    userId: number,
    sport: Sport,
  ): Promise<HttpStatus.ACCEPTED | HttpException> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        sports: true,
      },
    });
    if (user) {
      if (user.sports.length < this.maxSportsQuantity) {
        user.sports.push(sport);
        await this.userRepository.save(user);
        return HttpStatus.ACCEPTED;
      } else
        return new HttpException(
          `User can enroll in a maximum of ${this.maxSportsQuantity} sports`,
          HttpStatus.BAD_REQUEST,
        );
    }
    return idException;
  }

  async disenrollUserFromSport(
    userId: number,
    sportId: number,
  ): Promise<HttpStatus.ACCEPTED> {
    const user = await this.userRepository.findOneOrFail({
      where: {
        id: userId,
      },
      relations: {
        sports: true,
      },
    });
    user.sports = user.sports.filter(
      (userSport) => userSport.id !== Number(sportId),
    );
    await this.userRepository.save(user);
    return HttpStatus.ACCEPTED;
  }
  async updateUser(id: number, item: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOneByOrFail({ id: id });
    const updatedUser = await this.userRepository.save({
      id: user.id,
      name: item.name,
      age: item.age,
      email: item.email,
      sports: user.sports,
    });
    return updatedUser;
  }
  async deleteUser(id: number): Promise<HttpStatus.ACCEPTED> {
    const user = await this.userRepository.findOneByOrFail({ id: id });
    if (user) {
      await this.userRepository.delete(id);
      return HttpStatus.ACCEPTED;
    }
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
