import typeorm, {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Assignment } from "./Assignment.entity.js";
import { Review } from "./Review.entity.js";
import { Student } from "./Student.entity.js";
import { SubmissionAttachment } from "./SubmissionAttachment.entity.js";

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Assignment, (assignment) => assignment.submissions, {
    nullable: false,
  })
  @JoinColumn()
  assignment: typeorm.Relation<Assignment>;

  @Column("integer", { nullable: false })
  @RelationId((submission: Submission) => submission.assignment)
  assignmentId: number;

  @ManyToOne(() => Student, (student) => student.submissions, {
    nullable: false,
  })
  @JoinColumn()
  student: typeorm.Relation<Student>;

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
  review: typeorm.Relation<Review>;

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
  attachments: typeorm.Relation<SubmissionAttachment>;
}
