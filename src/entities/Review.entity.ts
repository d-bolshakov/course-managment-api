import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  RelationId,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { Mark, Submission } from ".";
import { BadRequest } from "http-errors";

export enum ReviewStatus {
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("enum", {
    enum: ReviewStatus,
    nullable: false,
  })
  status: ReviewStatus;

  @Column("varchar", { length: 255, nullable: true })
  comment: string;

  @OneToOne(() => Mark, (mark: Mark) => mark.review, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  mark!: Mark;

  @Column("integer", { nullable: true })
  @RelationId((review: Review) => review.mark)
  markId: number;

  @Column("timestamp", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @OneToOne(() => Submission, (submission: Submission) => submission.review)
  submission: Submission;

  @BeforeInsert()
  @BeforeUpdate()
  checkMark() {
    if (this.status === ReviewStatus.ACCEPTED && (!this.markId || !this.mark))
      throw BadRequest("review with status 'accepted' should have a mark");
    if (this.status === ReviewStatus.REJECTED && (this.markId || this.mark))
      throw BadRequest("review with status 'rejected' should not have a mark");
  }
}
