import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { Sport } from './modules/sport/sport.enitity';
import { UserModule } from './modules/user/user.module';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { Review } from './modules/review/review.entity';
import { Class } from './modules/class/class.entity';
import { SportController } from './modules/sport/sport.controller';
import { ReviewController } from './modules/review/review.controller';
import { SportService } from './modules/sport/sport.service';
import { ReviewService } from './modules/review/review.service';
import { SportModule } from './modules/sport/sport.module';
import { ReviewModule } from './modules/review/review.module';
import { ClassModule } from './modules/class/class.module';
import { ClassService } from './modules/class/class.service';
import { DailySchedule } from './modules/dailySchedule/dailySchedule.entity';
import { DailyScheduleModule } from './modules/dailySchedule/dailySchedule.module';
import { DailyScheduleController } from './modules/dailySchedule/dailySchedule.controller';
import { DailyScheduleService } from './modules/dailySchedule/dailySchedule.service';
import { ClassController } from './modules/class/class.controller';
import { AuthController } from './modules/auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
      entities: [User, Sport, Review, Class, DailySchedule],
    }),
    UserModule,
    SportModule,
    ReviewModule,
    ClassModule,
    DailyScheduleModule,
  ],
  controllers: [
    AuthController,
    UserController,
    SportController,
    ReviewController,
    ClassController,
    DailyScheduleController,
  ],
  providers: [
    UserService,
    SportService,
    ReviewService,
    ClassService,
    DailyScheduleService,
  ],
})
export class AppModule {}
