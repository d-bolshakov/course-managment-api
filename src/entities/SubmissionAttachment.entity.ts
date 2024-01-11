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
import { Assignment, File, Mark, Student, Submission } from "./";

@Entity()
export class SubmissionAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Submission, (submission) => submission.attachments, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  submission!: Submission;

  @Column("integer", { nullable: false })
  @RelationId(
    (submissionAttachment: SubmissionAttachment) =>
      submissionAttachment.submission
  )
  submissionId: number;

  @OneToOne(() => File, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn()
  file: File;

  @Column("string", { nullable: false })
  @RelationId(
    (submissionAttachment: SubmissionAttachment) => submissionAttachment.file
  )
  fileId: string;
}
