import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  RelationId,
  Column,
} from "typeorm";
import { User, Enrollment, Mark, Submission } from "./";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user!: User;

  @Column("integer", { nullable: false })
  @RelationId((student: Student) => student.user)
  userId: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student, {
    cascade: true,
  })
  enrollments!: Enrollment[];

  @OneToMany(() => Submission, (submission) => submission.student, {
    cascade: true,
  })
  submissions!: Submission[];
}
