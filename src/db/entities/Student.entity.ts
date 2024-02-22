import typeorm, {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  RelationId,
  Column,
} from "typeorm";
import { Enrollment } from "./Enrollment.entity.js";
import { Submission } from "./Submission.entity.js";
import { User } from "./User.entity.js";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user: typeorm.Relation<User>;

  @Column("integer", { nullable: false })
  @RelationId((student: Student) => student.user)
  userId: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student, {
    cascade: true,
  })
  enrollments: typeorm.Relation<Enrollment[]>;

  @OneToMany(() => Submission, (submission) => submission.student, {
    cascade: true,
  })
  submissions: typeorm.Relation<Submission[]>;
}
