import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateFrenchFeeDto } from '../../domain/dto/create-french-fee.dto';
import { FrenchFee } from '../../domain/entities/french-fee.entity';

import { UserProfile } from 'src/users/domain/entities/user-profile.entity';
import { getFrenchFeeResults } from '../usecases/get-french-fee-results';

@Injectable()
export class FrenchFeeService {
    constructor(
        @InjectRepository(FrenchFee)
        private frenchFeeRepository: Repository<FrenchFee>,
        @InjectRepository(UserProfile)
        private userProfileRepository: Repository<UserProfile>,
    ) {}

    // Method to create a new FrenchFee
    async create(createFrenchFeeDto: CreateFrenchFeeDto): Promise<FrenchFee> {

        const userProfile = await this.userProfileRepository.findOne({
            where: { user: { id: createFrenchFeeDto.userId } },
        });
        if (!userProfile) {
            throw new NotFoundException(`UserProfile with ID ${createFrenchFeeDto.userId} not found.`);
        }

        const frenchFee = this.frenchFeeRepository.create({
            ...createFrenchFeeDto,
            userProfile: userProfile,
        });

        return this.frenchFeeRepository.save(frenchFee);
    }

    // Method to find all FrenchFees
    async findAll(): Promise<FrenchFee[]> {
        return await this.frenchFeeRepository.find({ order: { id: 'ASC' } });
    }

    // Method to find a single FrenchFee by id
    async findOne(id: number): Promise<FrenchFee> {
        const frenchFee = await this.frenchFeeRepository.findOneOrFail({where: {id}});
        if (!frenchFee) {
            throw new NotFoundException(`The FrenchFee with ID ${id} was not found.`);
        }
        return frenchFee;
    }

    // Method to get the results of a FrenchFee by id
    async getResults(id: number): Promise<any> {
        const frenchFee = await this.frenchFeeRepository.findOneOrFail({where: {id}});
        if (!frenchFee) {
            throw new NotFoundException(`The FrenchFee with ID ${id} was not found.`);
        }
        return getFrenchFeeResults(frenchFee);
    }

    
}
