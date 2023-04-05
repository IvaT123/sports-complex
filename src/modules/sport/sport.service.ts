import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sport } from './sport.enitity';
import { ReadSportDto } from './dtos/readSport.dto';
import { CreateSportDto } from './dtos/createSport.dto';

@Injectable()
export class SportService {
  constructor(
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
  ) {}
  async getAllSports(): Promise<ReadSportDto[]> {
    return await this.sportRepository.find();
  }
  async getSportById(id: number): Promise<ReadSportDto> {
    return await this.sportRepository.findOneOrFail({
      where: {
        id: id,
      },
      relations: {
        ageGroups: true,
        users: true,
        reviews: true,
      },
    });
  }
  async createSport(item: CreateSportDto): Promise<CreateSportDto> {
    const sport = new CreateSportDto(
      item.id,
      item.name,
      item.description,
      item.classDuration,
      item.ageGroups,
    );
    return await this.sportRepository.save(sport);
  }
  async updateSport(id: number, item: CreateSportDto): Promise<CreateSportDto> {
    const user = await this.sportRepository.findOneByOrFail({ id: id });
    const updatedUser = await this.sportRepository.save({
      id: user.id,
      name: item.name,
      age: item.description,
      email: item.classDuration,
      sports: item.ageGroups,
    });
    return updatedUser;
  }
  async deleteSport(id: number): Promise<HttpStatus.ACCEPTED> {
    await this.sportRepository.delete(id);
    return HttpStatus.ACCEPTED;
  }
}
