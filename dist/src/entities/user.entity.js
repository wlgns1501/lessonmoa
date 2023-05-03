"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = exports.User = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const class_transformer_1 = require("class-transformer");
const lecense_entity_1 = require("./lecense.entity");
let User = class User extends typeorm_1.BaseEntity {
    async hashedPassword() {
        this.password = await bcrypt.hash(this.password, 9);
    }
    async validatedPassword(password) {
        const hash = await bcrypt.compare(password, this.password);
        return hash;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id', comment: 'PK' }),
    (0, swagger_1.ApiProperty)({ description: 'userId' }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', comment: '이메일' }),
    (0, swagger_1.ApiProperty)({
        description: 'email',
        nullable: false,
        required: true,
        example: 'wlgns1501@gmail.com',
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ name: 'password', comment: '비밀번호', nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: '비밀번호',
        nullable: false,
        required: true,
        example: 'gkstlsyjh116!',
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nickname', comment: '닉네임', nullable: true }),
    (0, swagger_1.ApiProperty)({
        description: '닉네임',
        nullable: false,
        required: true,
        example: 'jihun',
    }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isInstructor', comment: '강사 여부', default: false }),
    (0, swagger_1.ApiProperty)({ description: '강사 여부', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isInstructor", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', comment: '생성시간' }),
    (0, swagger_1.ApiProperty)({ description: '생성 시간' }),
    __metadata("design:type", String)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lecense_entity_1.License, (license) => license.user),
    __metadata("design:type", Array)
], User.prototype, "licenses", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashedPassword", null);
User = __decorate([
    (0, typeorm_1.Entity)({ name: 'user' }),
    (0, typeorm_1.Unique)(['email']),
    (0, typeorm_1.Unique)(['nickname'])
], User);
exports.User = User;
class UserInfo extends (0, swagger_1.PickType)(User, [
    'email',
    'password',
    'nickname',
]) {
}
exports.UserInfo = UserInfo;
//# sourceMappingURL=user.entity.js.map