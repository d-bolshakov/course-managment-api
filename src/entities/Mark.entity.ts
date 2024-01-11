import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
  OneToOne,
} from "typeorm";
import { Student, Course, Submission } from "./";

@Entity()
export class Mark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("integer", { nullable: false })
  mark: number;

  @Column("timestamp", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @OneToOne(() => Submission, (submission) => submission.mark)
  submission: Submission;
}
