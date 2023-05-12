"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const config_1 = require("@nestjs/config");
const license_module_1 = require("./license/license.module");
const category_module_1 = require("./category/category.module");
const sub_category_module_1 = require("./sub_category/sub_category.module");
const lesson_module_1 = require("./lesson/lesson.module");
const schedule_1 = require("@nestjs/schedule");
const location_module_1 = require("./location/location.module");
const place_module_1 = require("./place/place.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: 'config/.env' }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                autoLoadEntities: true,
                synchronize: false,
                logging: true,
                entities: ['dist/src/entities/**/*{.js,.ts}'],
                migrations: ['dist/migration/**/*{.js,.ts}'],
                subscribers: ['dist/subscribers/**/*{.js,.ts}'],
                cli: {
                    entitiesDir: 'entities',
                    migrationsDir: 'migration',
                },
            }),
            auth_module_1.AuthModule,
            license_module_1.LicenseModule,
            category_module_1.CategoryModule,
            sub_category_module_1.SubCategoryModule,
            lesson_module_1.LessonModule,
            schedule_1.ScheduleModule.forRoot(),
            location_module_1.LocationModule,
            place_module_1.PlaceModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map