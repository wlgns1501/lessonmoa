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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_repository_1 = require("../repositories/auth.repository");
const typeorm_1 = require("typeorm");
const http_error_1 = require("../constants/http-error");
const jwt = require("jsonwebtoken");
let AuthGuard = class AuthGuard {
    constructor(connection) {
        this.connection = connection;
    }
    async canActivate(context) {
        var _a;
        const req = context.switchToHttp().getRequest();
        const accessToken = (_a = req.get('cookie')) === null || _a === void 0 ? void 0 : _a.split('=')[1];
        if (!accessToken) {
            throw new common_1.HttpException({
                message: http_error_1.HTTP_ERROR.NEED_LOGIN_OR_REFRESH_TOKEN,
                detail: '로그인이 필요하거나 Refresh Token이 필요합니다.',
            }, common_1.HttpStatus.UNAUTHORIZED);
        }
        try {
            const verifiedToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
            const { email } = verifiedToken;
            this.authRepository = this.connection.getCustomRepository(auth_repository_1.AuthRepository);
            const user = await this.authRepository.findOne({ email });
            req['user'] = user;
            return true;
        }
        catch (error) {
            if (error.hasOwnProperty('expiredAt')) {
                throw new common_1.HttpException({
                    message: http_error_1.HTTP_ERROR.NEED_LOGIN_OR_REFRESH_TOKEN,
                    detail: 'need login or refresh token',
                }, common_1.HttpStatus.UNAUTHORIZED);
            }
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            return false;
        }
    }
};
AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.Connection])
], AuthGuard);
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map