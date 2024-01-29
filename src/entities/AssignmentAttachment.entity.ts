import typeorm, {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
  OneToOne,
} from "typeorm";
import { Assignment } from "./Assignment.entity.js";
import { File } from "./File.entity.js";

@Entity()
export class AssignmentAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Assignment, (assignment) => assignment.attachments, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  assignment: typeorm.Relation<Assignment>;

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
  file: typeorm.Relation<File>;

  @Column("string", { nullable: false })
  @RelationId(
    (assignmentAttachment: AssignmentAttachment) => assignmentAttachment.file
  )
  fileId: string;
}
