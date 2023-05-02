import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserModel1682998114336 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            create table if not exists "user" (
                "id" serial primary key not null,
                "email" varchar(50) unique not null ,
                "password" varchar(150) not null,
                "nickname" varchar(100) unique not null,
                "inInstructor" boolean default false,
                "createdAt" timestamp not null default now()
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        drop table if exists user
    `);
  }
}
