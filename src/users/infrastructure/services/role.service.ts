import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Role} from "../../domain/entities/role.entity";
import {Repository} from "typeorm";
import {CreateRoleDto} from "../../domain/dto/create-role.dto";
import {UpdateRoleDto} from "../../domain/dto/update-role.dto";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}
    async findAll(): Promise<Role[]> {
        return await this.roleRepository.find({ order: { id: 'ASC' } });
    }
    async findOne(id: number): Promise<Role> {
        const role = await this.roleRepository.findOne({where: {id}});
        if (!role) {
            throw new NotFoundException(`The role with ID ${id} was not found.`);
        }
        return role;
    }
    async create(newRole: CreateRoleDto): Promise<Role> {
        try {
            return await this.roleRepository.save(newRole);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('The role name already exists.');
            } else {
                throw error;
            }
        }
    }
    async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
        const existingRole = await this.roleRepository.findOne({where: {id}});

        if (!existingRole) {
            throw new NotFoundException(`The role with ID ${id} was not found.`);
        }

        existingRole.name = updateRoleDto.name || existingRole.name;
        existingRole.description = updateRoleDto.description || existingRole.description;

        return await this.roleRepository.save(existingRole);
    }
}