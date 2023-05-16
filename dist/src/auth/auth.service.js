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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const auth_repository_1 = require("../repositories/auth.repository");
const typeorm_1 = require("typeorm");
const signup_dto_1 = require("./dtos/signup.dto");
const typeorm_transactional_cls_hooked_1 = require("typeorm-transactional-cls-hooked");
const http_error_1 = require("../constants/http-error");
const postgres_error_1 = require("../constants/postgres-error");
const jwt = require("jsonwebtoken");
const user_entity_1 = require("../entities/user.entity");
const location_repository_1 = require("../repositories/location.repository");
let AuthService = class AuthService {
    constructor(connection) {
        this.connection = connection;
    }
    getAccessToken(user) {
        return jwt.sign({ email: user.email, isInstructor: user.isInstructor }, process.env.JWT_SECRET_KEY, { expiresIn: '8h' });
    }
    getRefreshToken(user) {
        return jwt.sign({ email: user.email, isInstructor: user.isInstructor }, process.env.JWT_SECRET_KEY, { expiresIn: '2d' });
    }
    async signUp(signUpDto) {
        try {
            this.authRepository = this.connection.getCustomRepository(auth_repository_1.AuthRepository);
            this.locationRepository =
                this.connection.getCustomRepository(location_repository_1.LocationRepository);
            const { locationId } = signUpDto;
            const location = await this.locationRepository.getLocationById(locationId);
            await this.authRepository.signUp(signUpDto, location);
            return { success: true };
        }
        catch (error) {
            switch (error.code) {
                case postgres_error_1.POSTGRES_ERROR_CODE.DUPLICATED_KEY_ERROR:
                    if (error.detail.includes('email')) {
                        throw new common_1.HttpException({
                            message: http_error_1.HTTP_ERROR.DUPLICATED_KEY_ERROR,
                            detail: '중복된 이메일입니다.',
                        }, common_1.HttpStatus.BAD_REQUEST);
                    }
                    else if (error.detail.includes('nickname')) {
                        throw new common_1.HttpException({
                            message: http_error_1.HTTP_ERROR.DUPLICATED_KEY_ERROR,
                            detail: '중복된 닉네임입니다.',
                        }, common_1.HttpStatus.BAD_REQUEST);
                    }
            }
            console.error();
        }
    }
    async signIn(signInDto) {
        this.authRepository = this.connection.getCustomRepository(auth_repository_1.AuthRepository);
        const { email, password } = signInDto;
        const user = await this.authRepository.findOne({
            email,
        });
        if (!user) {
            throw new common_1.HttpException({
                message: http_error_1.HTTP_ERROR.NOT_FOUND,
                detail: '해당 유저는 존재하지 않습니다.',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const isValidated = await user.validatedPassword(password);
        if (!isValidated)
            throw new common_1.HttpException({
                message: http_error_1.HTTP_ERROR.BAD_REQUEST,
                detail: '올바른 비밀번호가 아닙니다.',
            }, common_1.HttpStatus.BAD_REQUEST);
        const accessToken = this.getAccessToken(user);
        const refreshToken = this.getRefreshToken(user);
        return { accessToken, refreshToken };
    }
    async signOut(user) {
        this.authRepository = this.connection.getCustomRepository(auth_repository_1.AuthRepository);
        const userId = user.id;
        await this.authRepository.signOut(userId);
    }
};
__decorate([
    (0, typeorm_transactional_cls_hooked_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "signUp", null);
__decorate([
    (0, typeorm_transactional_cls_hooked_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "signOut", null);
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.Connection])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map