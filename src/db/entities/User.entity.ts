import typeorm, {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  RelationId,
} from "typeorm";
import { Student } from "./Student.entity.js";
import { Teacher } from "./Teacher.entity.js";

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

  @Column("enum", { enum: Role, nullable: true })
  role: Role | null;

  @OneToOne(() => Student, (student: Student) => student.user, {
    cascade: true,
  })
  studentProfile?: typeorm.Relation<Student>;

  @OneToOne(() => Teacher, (teacher) => teacher.user, { cascade: true })
  teacherProfile?: typeorm.Relation<Teacher>;
}
