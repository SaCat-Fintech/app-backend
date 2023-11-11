import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { RoleService } from "../../infrastructure/services/role.service";
import { Role } from "../../domain/entities/role.entity";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateRoleDto, UpdateRoleDto } from "../../domain/dto/role.dto";

@ApiTags('roles')
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    @ApiResponse({ status: 200, type: [Role], description: 'Get all roles.'})
    async findAll(): Promise<Role[]> {
        return await this.roleService.findAll();
    }

    @Get(':id')
    @ApiResponse({ status: 200, type: Role, description: 'Get role by id.'})
    async findOne(@Param('id') id: number): Promise<Role> {
        return await this.roleService.findOne(id);
    }

    @Post()
    @ApiBody({ type: CreateRoleDto })
    @ApiResponse({ status: 201, type: Role, description: 'Create role.'})
    async create(@Body() roleData: CreateRoleDto): Promise<Role> {
        return await this.roleService.create(roleData);
    }

    @Put(':id')
    @ApiBody({ type: UpdateRoleDto })
    @ApiResponse({ status: 200, type: Role, description: 'Update role.'})
    async update(@Param('id') id: number, @Body() roleData: UpdateRoleDto): Promise<Role> {
        return await this.roleService.update(id, roleData);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Delete role.'})
    async delete(@Param('id') id: number): Promise<String> {
        return await this.roleService.delete(id);
    }
}