"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const typeorm_transactional_cls_hooked_1 = require("typeorm-transactional-cls-hooked");
async function bootstrap() {
    (0, typeorm_transactional_cls_hooked_1.initializeTransactionalContext)();
    (0, typeorm_transactional_cls_hooked_1.patchTypeORMRepositoryWithBaseRepository)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('LessonMoa')
        .setDescription('LessonMoa API description')
        .setVersion('3.0')
        .addBearerAuth({
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        name: 'JWT',
        bearerFormat: 'JWT',
    }, 'authorization')
        .build();
    const swaggerCustomOptions = {
        swaggerOptions: {
            persistAuthorization: true,
        },
    };
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, swaggerCustomOptions);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map