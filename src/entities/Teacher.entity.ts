import typeorm, {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
  RelationId,
  Column,
} from "typeorm";
import { Course } from "./Course.entity.js";
import { Subject } from "./Subject.entity.js";
import { User } from "./User.entity.js";

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user: typeorm.Relation<User>;

  @Column("integer", { nullable: false })
  @RelationId((teacher: Teacher) => teacher.user)
  userId: number;

  @ManyToMany(() => Subject, (subject) => subject.teachers, { cascade: true })
  @JoinTable({ name: "teacher_subject" })
  subjects: typeorm.Relation<Subject[]>;

  @OneToMany(() => Course, (course) => course.teacher, { cascade: true })
  courses: typeorm.Relation<Course[]>;
}
