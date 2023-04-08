import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AgeGroup } from '../ageGroup/ageGroup';
import { Sport } from '../sport/sport.enitity';
import { Class } from '../class/class.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  email: string;

  @Column('enum', { enum: AgeGroup })
  ageGroup: AgeGroup;

  @ManyToMany(() => Sport, (sport) => sport.users)
  sports: Sport[];

  @ManyToMany(() => Class, (classInstance) => classInstance.users)
  @JoinTable()
  classes: Class[];
}
