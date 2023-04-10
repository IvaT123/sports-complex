import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { ReadUserDto } from './dtos/readUser.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AgeGroup } from '../ageGroup/ageGroup';
import { Sport } from '../sport/sport.enitity';
import { idException } from 'src/exceptions/idException';
import { Class } from '../class/class.entity';
import { generateToken } from '../auth/generateToken';
import { sendVerificationEmail } from '../auth/verifyUser';

@Injectable()
export class UserService {
  private readonly maxSportsQuantity: number = 2;
  private readonly maxUsersPerClassQuantity: number = 10;
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
        classes: true,
      },
    });
  }

  async getUserByVerificationToken(token: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { verificationToken: token },
    });
  }

  async createUser(item: CreateUserDto): Promise<CreateUserDto> {
    const verificationToken = generateToken();
    const user = new CreateUserDto(
      item.id,
      item.name,
      item.age,
      item.email,
      verificationToken,
      false,
      this.calculateAgeGroup(item.age),
      item.sports,
      item.classes,
    );
    const newUser = await this.userRepository.save(user);
    await sendVerificationEmail(user.email, verificationToken);
    return newUser;
  }

  async verifyUser(id: number, item: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOneByOrFail({ id: id });
    const verifiedUser = await this.userRepository.save({
      id: user.id,
      name: item.name,
      age: item.age,
      email: item.email,
      verificationToken: item.verificationToken,
      isVerified: item.isVerified,
      sports: user.sports,
    });
    return verifiedUser;
  }

  async enrollUserInSport(
    userId: number,
    sport: Sport,
    classes: Class[],
  ): Promise<HttpStatus.ACCEPTED | HttpException> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        sports: true,
        classes: true,
      },
    });
    const sportClass = classes.find(
      (singleClass) => singleClass.ageGroup === user.ageGroup,
    );
    if (user && user.isVerified) {
      if (user.sports.length < this.maxSportsQuantity) {
        if (sportClass.users.length < this.maxUsersPerClassQuantity) {
          user.sports.push(sport);
          user.classes.push(...sport.classes);
          await this.userRepository.save(user);
        } else
          return new HttpException(
            `User cannot enroll in this sport because maximum capacity of users in ${sportClass.ageGroup.toLowerCase()} group per class is ${
              this.maxUsersPerClassQuantity
            }`,
            HttpStatus.BAD_REQUEST,
          );
        return HttpStatus.ACCEPTED;
      } else
        return new HttpException(
          `User is already enrolled in ${this.maxSportsQuantity} sports, which is a maximum`,
          HttpStatus.BAD_REQUEST,
        );
    }
    return idException;
  }

  async disenrollUserFromSport(
    userId: number,
    sportId: number,
    classesIds: number[],
  ): Promise<HttpStatus.ACCEPTED> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        sports: true,
        classes: true,
      },
    });
    if (user && user.isVerified) {
      user.sports = user.sports.filter(
        (userSport) => userSport.id !== Number(sportId),
      );
      user.classes = user.classes.filter(
        (sportClass) => !classesIds.includes(sportClass.id),
      );
      await this.userRepository.save(user);
      return HttpStatus.ACCEPTED;
    }
  }
  async assignClassToUsers(users: User[], sportClass: Class) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.ageGroup === sportClass.ageGroup && user.isVerified) {
        const userById = await this.userRepository.findOne({
          where: {
            id: user.id,
          },
          relations: {
            classes: true,
          },
        });
        userById.classes = [...userById.classes, sportClass];
        await this.userRepository.save(userById);
      }
    }
  }
  async updateUser(id: number, item: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOneByOrFail({ id: id });
    const updatedUser = await this.userRepository.save({
      id: user.id,
      name: item.name,
      age: item.age,
      email: item.email,
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
