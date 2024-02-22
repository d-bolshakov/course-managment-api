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
import { File } from "./File.entity.js";
import { Submission } from "./Submission.entity.js";

@Entity()
export class SubmissionAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Submission, (submission) => submission.attachments, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  submission: typeorm.Relation<Submission>;

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
  file: typeorm.Relation<File>;

  @Column("string", { nullable: false })
  @RelationId(
    (submissionAttachment: SubmissionAttachment) => submissionAttachment.file
  )
  fileId: string;
}
