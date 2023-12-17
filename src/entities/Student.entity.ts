import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User, Enrollment } from "./";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user!: User;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student, {
    cascade: true,
  })
  enrollments!: Enrollment[];
}
