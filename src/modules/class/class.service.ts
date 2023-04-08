import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';
import { ReadClassDto } from './dtos/readClass.dto';
import { CreateClassDto } from './dtos/createClass.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}
  async getAllClasses(): Promise<ReadClassDto[]> {
    return await this.classRepository.find();
  }
  async getClassesBySportId(id: number): Promise<Class[]> {
    return await this.classRepository.find({
      where: { sport: { id: id } },
    });
  }
  async getClassById(id: number): Promise<Class> {
    return await this.classRepository.findOneOrFail({
      where: { id: id },
      relations: ['users', 'sport', 'reviews', 'weeklySchedule'],
    });
  }
  async createClass(item: CreateClassDto): Promise<CreateClassDto> {
    const sportsClass = new CreateClassDto(
      item.id,
      item.description,
      item.duration,
      item.ageGroup,
      item.sport,
    );
    return await this.classRepository.save(sportsClass);
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
