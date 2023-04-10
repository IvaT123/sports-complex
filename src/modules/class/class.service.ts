import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';
import { CreateClassDto } from './dtos/createClass.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}
  async getAllClasses(
    sports?: string,
    duration?: string,
    ageGroups?: string,
    dayOfWeek?: string,
  ): Promise<Class[]> {
    const query = this.classRepository.createQueryBuilder('class');

    if (sports) {
      const sportsArray = sports.split(',');
      if (sportsArray.length > 1) {
        query
          .leftJoinAndSelect('class.sport', 'sport')
          .andWhere('sport.name IN (:...sports)')
          .setParameter('sports', sportsArray)
          .groupBy('class.id, sport.id');
      } else {
        query
          .leftJoinAndSelect('class.sport', 'sport')
          .andWhere('sport.name = :sports')
          .setParameter('sports', sportsArray[0]);
      }
    }

    if (ageGroups) {
      const groupsArray = ageGroups.split(',');
      if (groupsArray.length > 1) {
        query.andWhere('class.ageGroup IN (:...groups)', {
          groups: groupsArray,
        });
      } else {
        query.andWhere('class.ageGroup = :ageGroup', {
          ageGroup: groupsArray[0],
        });
      }
    }

    if (duration) {
      const [hours, minutes] = duration.split(':').map(Number);
      const interval =
        minutes > 0 ? `${minutes} minutes ${hours} hours` : `${hours} hours`;

      query.andWhere('class.duration = :duration', { duration: interval });
    }

    if (dayOfWeek) {
      query
        .leftJoinAndSelect('class.schedule', 'schedule')
        .where('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek });
    }

    return await query.getMany();
  }

  async getClassesBySportId(id: number): Promise<Class[]> {
    return await this.classRepository.find({
      where: { sport: { id: id } },
      relations: ['users'],
    });
  }

  async getClassById(id: number): Promise<Class> {
    return await this.classRepository.findOneOrFail({
      where: { id: id },
      relations: ['users', 'sport', 'reviews', 'schedule'],
    });
  }

  async createClass(
    item: CreateClassDto,
    classes: Class[],
  ): Promise<CreateClassDto | HttpException> {
    const sportClass = new CreateClassDto(
      item.id,
      item.description,
      item.duration,
      item.ageGroup,
      item.sport,
    );
    const classExists = classes.some(
      (singleClass) => singleClass.ageGroup === sportClass.ageGroup,
    );

    if (!classExists) {
      return await this.classRepository.save(sportClass);
    } else
      return new HttpException(
        `Classes for ${sportClass.ageGroup.toLowerCase()} already exist for this sport`,
        HttpStatus.BAD_REQUEST,
      );
  }

  async updateClass(id: number, item: Class): Promise<Class> {
    const sportsClass = await this.classRepository.findOne({
      where: { id: id },
      relations: ['users', 'sport', 'reviews'],
    });
    const updatedClass = await this.classRepository.save({
      id: sportsClass.id,
      description: item.description,
      duration: sportsClass.sport.classDuration,
      ageGroup: item.ageGroup,
      sport: item.sport,
      averageRating: item.averageRating,
    });
    return updatedClass;
  }

  async deleteClass(id: number): Promise<HttpStatus.ACCEPTED> {
    const sportClass = await this.classRepository.findOneByOrFail({
      id: id,
    });

    if (sportClass) {
      await this.classRepository.delete(id);
      return HttpStatus.ACCEPTED;
    }
  }
}
