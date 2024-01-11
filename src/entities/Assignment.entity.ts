import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  RelationId,
  OneToOne,
} from "typeorm";
import { AssignmentAttachment, Course, File, Submission } from "./";

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 30, nullable: false })
  title: string;

  @Column("varchar", { length: 255, nullable: false })
  text: string;

  @ManyToOne(() => Course, (course) => course.assignments, { nullable: false })
  @JoinColumn()
  course!: Course;

  @Column("integer", { nullable: false })
  @RelationId((assignment: Assignment) => assignment.course)
  courseId: number;

  @Column("timestamp", { nullable: false })
  deadline: Date;

  @Column("timestamp", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @OneToMany(() => Submission, (Submission) => Submission.assignment, {
    cascade: true,
  })
  submissions!: Submission[];

  @OneToMany(
    () => AssignmentAttachment,
    (assignmentAttachment: AssignmentAttachment) =>
      assignmentAttachment.assignment,
    {
      onDelete: "CASCADE",
      nullable: false,
    }
  )
  attachments: AssignmentAttachment;
}
