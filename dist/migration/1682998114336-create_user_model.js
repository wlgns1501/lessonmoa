"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserModel1682998114336 = void 0;
class createUserModel1682998114336 {
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`
        drop table if exists user
    `);
    }
}
exports.createUserModel1682998114336 = createUserModel1682998114336;
//# sourceMappingURL=1682998114336-create_user_model.js.map