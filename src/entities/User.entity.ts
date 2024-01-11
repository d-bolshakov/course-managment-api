import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  RelationId,
} from "typeorm";
import { Message, Student, Teacher } from "./";

export enum Role {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 30, nullable: false })
  firstName: string;

  @Column("varchar", { length: 50, nullable: false })
  lastName: string;

  @Column("varchar", { length: 100, unique: true, nullable: false })
  email: string;

  @Column("boolean", { default: false, nullable: false })
  isEmailConfirmed: boolean;

  @Column("varchar", { length: 100, nullable: false })
  password: string;

  @Column("enum", { enum: Role, default: Role.STUDENT, nullable: false })
  role: Role;

  @OneToOne(() => Student, (student) => student.user, { cascade: true })
  studentProfile?: Student;

  @OneToOne(() => Teacher, (teacher) => teacher.user, { cascade: true })
  teacherProfile?: Teacher;

  @OneToMany(() => Message, (message) => message.sender, { cascade: true })
  sentMessages!: Message[];

  @OneToMany(() => Message, (message) => message.receiver, { cascade: true })
  receivedMessages!: Message[];
}
