import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AgeGroup } from '../ageGroup/ageGroup';
import { Sport } from '../sport/sport.enitity';
import { Class } from '../class/class.entity';
import { Review } from '../review/review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  @Unique(['email'])
  email: string;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column('enum', { enum: AgeGroup })
  ageGroup: AgeGroup;

  @ManyToMany(() => Sport, (sport) => sport.users)
  sports: Sport[];

  @ManyToMany(() => Class, (classInstance) => classInstance.users)
  @JoinTable()
  classes: Class[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
