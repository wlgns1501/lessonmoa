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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const signup_dto_1 = require("./dtos/signup.dto");
const signup_pipe_1 = require("./dtos/signup.pipe");
const signin_pipe_1 = require("./dtos/signin.pipe");
const signin_dto_1 = require("./dtos/signin.dto");
let AuthController = class AuthController {
    constructor(service) {
        this.service = service;
    }
    signUp(signUpDto) {
        return this.service.signUp(signUpDto);
    }
    async signIn(signInDto, response) {
        return this.service.signIn(signInDto);
    }
};
__decorate([
    (0, common_1.Post)('/signup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: '회원가입' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Body)(new signup_pipe_1.SignUpPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignUpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('/signin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: '로그인' }),
    __param(0, (0, common_1.Body)(new signin_pipe_1.SignInPipe())),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signin_dto_1.SignInDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map