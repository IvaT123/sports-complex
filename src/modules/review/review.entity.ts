import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Class } from '../class/class.entity';
import { User } from '../user/user.entity';

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

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;
}
