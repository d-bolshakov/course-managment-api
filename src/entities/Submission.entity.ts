import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Assignment, Review, Student, SubmissionAttachment } from "./";

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Assignment, (assignment) => assignment.submissions, {
    nullable: false,
  })
  @JoinColumn()
  assignment!: Assignment;

  @Column("integer", { nullable: false })
  @RelationId((submission: Submission) => submission.assignment)
  assignmentId: number;

  @ManyToOne(() => Student, (student) => student.submissions, {
    nullable: false,
  })
  @JoinColumn()
  student!: Student;

  @Column("integer", { nullable: false })
  @RelationId((submission: Submission) => submission.student)
  studentId: number;

  @Column("varchar", { length: 255, nullable: false })
  text: string;

  @Column("varchar", { length: 255, nullable: false })
  comment: string;

  @OneToOne(() => Review, (review: Review) => review.submission, {
    nullable: true,
  })
  @JoinColumn()
  review: Review;

  @Column("integer", { nullable: true })
  @RelationId((submission: Submission) => submission.review)
  reviewId: number;

  @Column("timestamp", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @OneToMany(
    () => SubmissionAttachment,
    (submissionAttachment: SubmissionAttachment) =>
      submissionAttachment.submission,
    {
      onDelete: "CASCADE",
      nullable: false,
    }
  )
  attachments: SubmissionAttachment;
}
