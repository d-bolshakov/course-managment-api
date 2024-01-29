import typeorm, {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  RelationId,
} from "typeorm";
import { Assignment } from "./Assignment.entity.js";
import { Enrollment } from "./Enrollment.entity.js";
import { Subject } from "./Subject.entity.js";
import { Teacher } from "./Teacher.entity.js";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 30, nullable: false })
  title: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  @JoinColumn()
  teacher: typeorm.Relation<Teacher>;

  @Column("integer", { nullable: false })
  @RelationId((course: Course) => course.teacher)
  teacherId: number;

  @ManyToOne(() => Subject, { nullable: false })
  @JoinColumn()
  subject: typeorm.Relation<Subject>;

  @Column("integer", { nullable: false })
  @RelationId((course: Course) => course.subject)
  subjectId: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: typeorm.Relation<Enrollment[]>;

  @Column("integer", { nullable: false })
  maxStudents: number;

  @Column("timestamp", { nullable: false })
  startsAt: Date;

  @Column("timestamp", { nullable: false })
  endsAt: Date;

  @OneToMany(() => Assignment, (assignment) => assignment.course, {
    cascade: true,
  })
  assignments: typeorm.Relation<Assignment[]>;
}
