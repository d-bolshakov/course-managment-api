import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Student, Teacher } from "./";

export enum Role {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column("varchar", { length: 30, nullable: false })
  firstName: string = "";

  @Column("varchar", { length: 50, nullable: false })
  lastName: string = "";

  @Column("varchar", { length: 100, unique: true, nullable: false })
  email: string = "";

  @Column("boolean", { default: false, nullable: false })
  isEmailConfirmed: boolean = false;

  @Column("varchar", { length: 100, nullable: false })
  password: string = "";

  @Column("enum", { enum: Role, default: Role.STUDENT, nullable: false })
  role: Role = Role.STUDENT;

  @OneToOne(() => Student, (student) => student.user, { cascade: true })
  studentProfile?: Student;

  @OneToOne(() => Teacher, (teacher) => teacher.user, { cascade: true })
  teacherProfile?: Teacher;
}
