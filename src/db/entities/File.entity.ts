import typeorm, { Entity, PrimaryColumn, Column, OneToOne } from "typeorm";
import { SubmissionAttachment } from "./SubmissionAttachment.entity.js";
import { AssignmentAttachment } from "./AssignmentAttachment.entity.js";

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
  submissionAttachment?: typeorm.Relation<SubmissionAttachment>;

  @OneToOne(
    () => AssignmentAttachment,
    (assignmentAttachment: AssignmentAttachment) => assignmentAttachment.file,
    { cascade: true }
  )
  assignmentAttachment?: typeorm.Relation<AssignmentAttachment>;
}
