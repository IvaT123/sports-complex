import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgeGroup } from '../age-group/ageGroup';
import { User } from '../user/user.entity';
import { Review } from '../review/review.entity';
import { Class } from '../class/class.entity';

@Entity()
export class Sport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'interval' })
  classDuration: string;

  @Column('enum', { enum: AgeGroup, array: true })
  ageGroups: AgeGroup[];

  @ManyToMany(() => User, (user) => user.sports)
  @JoinTable()
  users: User[];

  @OneToMany(() => Review, (review) => review.sport)
  reviews: Review[];

  @OneToMany(() => Class, (classInstance) => classInstance.sport)
  classes: Class[];
}
