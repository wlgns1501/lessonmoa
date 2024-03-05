import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LicenseModule } from './license/license.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub_category/sub_category.module';
import { LocationModule } from './location/location.module';
import { PlaceModule } from './place/place.module';
// import typeOrmConfig from 'ormconfig';

@Module({
  imports: [
    // TypeOrmModule.forRoot(typeOrmConfig),
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
    LocationModule,
    PlaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
