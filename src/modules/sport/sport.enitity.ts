import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Class } from '../class/class.entity';

@Entity()
export class Sport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['name'])
  name: string;

  @Column({ type: 'interval' })
  classDuration: string;

  @ManyToMany(() => User, (user) => user.sports)
  @JoinTable()
  users: User[];

  @OneToMany(() => Class, (classInstance) => classInstance.sport)
  classes: Class[];
}
