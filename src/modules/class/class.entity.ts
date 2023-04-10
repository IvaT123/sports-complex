import {
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
import { DailySchedule } from '../dailySchedule/dailySchedule.entity';

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
  schedule: DailySchedule[];

  @ManyToOne(() => Sport, (sport) => sport.classes)
  sport: Sport;

  @ManyToMany(() => User, (user) => user.classes)
  users: User[];

  @OneToMany(() => Review, (review) => review.sportClass)
  reviews: Review[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  averageRating: number;

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
