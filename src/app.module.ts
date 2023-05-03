import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LisenceModule } from './lisence/lisence.module';

// import typeOrmConfig from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'config/.env' }),
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
        entitiesDir: 'src/entities',
        migrationsDir: 'migration',
      },
    }),
    AuthModule,
    LisenceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
