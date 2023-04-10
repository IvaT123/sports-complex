import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Class } from '../class/class.entity';

@Entity()
export class DailySchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  dayOfWeek: string;

  @ManyToOne(() => Class, (sportClass) => sportClass.schedule)
  sportClass: Class;
}
