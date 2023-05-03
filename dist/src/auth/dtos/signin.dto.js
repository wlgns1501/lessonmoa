"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../entities/user.entity");
class SignInDto extends (0, swagger_1.PickType)(user_entity_1.User, ['email', 'password']) {
}
exports.SignInDto = SignInDto;
//# sourceMappingURL=signin.dto.js.map