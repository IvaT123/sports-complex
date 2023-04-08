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
  async getSportById(id: number): Promise<Sport> {
    return await this.sportRepository.findOne({
      where: { id: Number(id) },
      relations: ['users', 'classes'],
    });
  }
  async createSport(item: CreateSportDto): Promise<Sport> {
    const sport = new CreateSportDto(item.id, item.name, item.classDuration);
    return await this.sportRepository.save(sport);
  }
  async updateSport(id: number, item: Sport): Promise<Sport> {
    const sport = await this.sportRepository.findOneByOrFail({ id: id });

    const updatedSport = await this.sportRepository.save({
      id: sport.id,
      name: item.name,
      classDuration: item.classDuration,
      users: item.users,
      classes: item.classes,
    });
    return updatedSport;
  }
  async deleteSport(id: number): Promise<HttpStatus.ACCEPTED> {
    const sport = await this.sportRepository.findOneByOrFail({ id: id });
    if (sport) {
      await this.sportRepository.delete(id);
      return HttpStatus.ACCEPTED;
    }
  }
}
