import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sport } from '../sport/sport.enitity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @ManyToOne(() => Sport, (sport) => sport.reviews)
  sport: Sport;
}
