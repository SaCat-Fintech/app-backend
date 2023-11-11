import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar', length: 32, nullable: false })
    email: string;
    @Column({ type: 'varchar', length: 100, nullable: false })
    password_hash: string;
}