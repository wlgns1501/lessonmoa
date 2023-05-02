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
let AuthService = class AuthService {
    constructor(connection) {
        this.connection = connection;
    }
    async signUp(signUpDto) {
        try {
            this.authRepository = this.connection.getCustomRepository(auth_repository_1.AuthRepository);
            await this.authRepository.signUp(signUpDto);
            return { success: true };
        }
        catch (error) {
            console.log(error);
            console.error();
        }
    }
};
__decorate([
    (0, typeorm_transactional_cls_hooked_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "signUp", null);
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.Connection])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map