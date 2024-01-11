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
import { Assignment, File, Mark, Student, SubmissionAttachment } from "./";

export enum SubmissionStatus {
  SUBMITTED = "submitted",
  REVIEWED = "reviewed",
  REJECTED = "rejected",
}

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

  @Column("varchar", { length: 255, nullable: true })
  reviewComment: string;

  @ManyToOne(() => Mark, { nullable: true })
  @JoinColumn()
  mark!: Mark;

  @Column("integer", { nullable: true })
  @RelationId((submission: Submission) => submission.mark)
  markId: number;

  @Column("timestamp", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column("enum", {
    enum: SubmissionStatus,
    default: SubmissionStatus.SUBMITTED,
    nullable: false,
  })
  status: SubmissionStatus = SubmissionStatus.SUBMITTED;

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
