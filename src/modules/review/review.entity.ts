import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Class } from '../class/class.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @ManyToOne(() => Class, (sportClass) => sportClass.reviews)
  sportClass: Class;
}
