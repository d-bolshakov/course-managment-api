import typeorm, {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
} from "typeorm";
import { Review } from "./Review.entity.js";

@Entity()
export class Mark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("integer", { nullable: false })
  mark: number;

  @Column("timestamp", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @OneToOne(() => Review, (review: Review) => review.mark)
  review: typeorm.Relation<Review>;
}
