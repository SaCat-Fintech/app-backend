import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { RoleService } from "../../infrastructure/services/role.service";
import { RoleController } from "../../interfaces/controllers/role.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    providers: [RoleService],
    controllers: [RoleController],
    exports: [TypeOrmModule],
})
export class RolesModule {}
