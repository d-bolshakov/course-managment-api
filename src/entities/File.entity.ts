import { Entity, PrimaryColumn, Column, OneToOne } from "typeorm";
import { SubmissionAttachment } from "./SubmissionAttachment.entity";
import { AssignmentAttachment } from "./AssignmentAttachment.entity";

@Entity()
export class File {
  @PrimaryColumn()
  id: string;

  @Column("varchar", { length: 30, nullable: false })
  filename: string;

  @Column("varchar", { length: 30, nullable: false })
  mimetype: string;

  @Column("timestamp", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @OneToOne(
    () => SubmissionAttachment,
    (submissionAttachment: SubmissionAttachment) => submissionAttachment.file,
    { cascade: true }
  )
  submissionAttachment?: SubmissionAttachment;

  @OneToOne(
    () => AssignmentAttachment,
    (assignmentAttachment: AssignmentAttachment) => assignmentAttachment.file,
    { cascade: true }
  )
  assignmentAttachment?: AssignmentAttachment;
}
