import typeorm, {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  RelationId,
} from "typeorm";
import { AssignmentAttachment } from "./AssignmentAttachment.entity.js";
import { Course } from "./Course.entity.js";
import { Submission } from "./Submission.entity.js";

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
  course: typeorm.Relation<Course>;

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
  submissions: typeorm.Relation<Submission[]>;

  @OneToMany(
    () => AssignmentAttachment,
    (assignmentAttachment: AssignmentAttachment) =>
      assignmentAttachment.assignment,
    {
      onDelete: "CASCADE",
      nullable: false,
    }
  )
  attachments: typeorm.Relation<AssignmentAttachment>;
}
