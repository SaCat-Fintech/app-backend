import {DynamicModule} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Role} from "./users/domain/entities/role.entity";
import {UserProfile} from "./users/domain/entities/user-profile.entity";
import {User} from "./users/domain/entities/user.entity";

export const databaseConfig: TypeOrmModule= {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'sacat_test',
    entities: [Role, User, UserProfile],
    //entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    //synchronize: process.env.NODE_ENV !== 'production',
    synchronize: true,
};
