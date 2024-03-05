import { MigrationInterface, QueryRunner } from 'typeorm';

export class createLicenseModel1683163312725 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            create table if not exists "license" (
                "id" serial primary key not null,
                "name" varchar(100) not null,
                "imageUrl" varchar(500) not null,
                "status" varchar(50) default 'PENDING',
                "createdAt" timestamp not null default now(),

                foreign key ("userId")
                    references "user" (id)
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        drop table if exists "license"
    `);
  }
}
