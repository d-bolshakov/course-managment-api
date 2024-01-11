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
export class AssignmentAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Assignment, (assignment) => assignment.attachments, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  assignment!: Assignment;

  @Column("integer", { nullable: false })
  @RelationId(
    (assignmentAttachment: AssignmentAttachment) =>
      assignmentAttachment.assignment
  )
  assignmentId: number;

  @OneToOne(() => File, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn()
  file: File;

  @Column("string", { nullable: false })
  @RelationId(
    (assignmentAttachment: AssignmentAttachment) => assignmentAttachment.file
  )
  fileId: string;
}
