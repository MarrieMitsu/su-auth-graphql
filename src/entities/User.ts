// Packages
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, BaseEntity } from "typeorm";

// User Entity
@Entity("users")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id!: number;

    @Column("text")
    name!: string;

    @Column()
    username!: string;

    @Column({ unique: true })
    email!: string;

    @Column("text")
    password!: string;

    @Column()
    profileImage: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}