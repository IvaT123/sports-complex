import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sport } from '../sport/sport.enitity';
import { User } from '../user/user.entity';
import { AgeGroup } from '../ageGroup/ageGroup';
import { Review } from '../review/review.entity';
import { DailySchedule } from '../dailySchedule.ts/dailySchedule.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  duration: string;

  @Column()
  ageGroup: AgeGroup;

  @OneToMany(() => DailySchedule, (dailySchedule) => dailySchedule.sportClass)
  weeklySchedule: DailySchedule[];

  @ManyToOne(() => Sport, (sport) => sport.classes)
  sport: Sport;

  @ManyToMany(() => User, (user) => user.classes)
  users: User[];

  @OneToMany(() => Review, (review) => review.sportClass)
  reviews: Review[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  averageRating: number;

  @BeforeInsert()
  @BeforeUpdate()
  validateUsersLength() {
    if (this.users && this.users.length > 10) {
      throw new Error('The maximum number of users for a class is 10');
    }
  }

  updateAverageRating() {
    if (this.reviews.length === 0) {
      return 0;
    } else {
      const totalRating = this.reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      return totalRating / this.reviews.length;
    }
  }
}
