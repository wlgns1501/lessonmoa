import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LicenseModule } from './license/license.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub_category/sub_category.module';
import { LessonModule } from './lesson/lesson.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'config/.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      // cache: false,
      entities: ['dist/src/entities/**/*{.js,.ts}'],
      migrations: ['dist/migration/**/*{.js,.ts}'],
      subscribers: ['dist/subscribers/**/*{.js,.ts}'],
      cli: {
        entitiesDir: 'entities',
        migrationsDir: 'migration',
      },
    }),
    AuthModule,
    LicenseModule,
    CategoryModule,
    SubCategoryModule,
    LessonModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
