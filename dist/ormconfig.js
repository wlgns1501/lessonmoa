"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeOrmConfig = {
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
        entitiesDir: 'src/entities',
        migrationsDir: 'migration',
    },
};
exports.default = typeOrmConfig;
//# sourceMappingURL=ormconfig.js.map