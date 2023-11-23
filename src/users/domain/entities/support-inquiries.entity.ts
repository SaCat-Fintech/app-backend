import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";

@Entity({ name: 'support_inquiries' })
export class SupportInquiries{
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ type: 'varchar', length: 32, nullable: false})
    email: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 50, nullable: false })
    full_name: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 12, nullable: false })
    phone_number: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 500, nullable: false })
    subject: string;
}