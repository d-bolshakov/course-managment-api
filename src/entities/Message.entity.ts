import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
  RelationId,
} from "typeorm";
import { User, Assignment, File } from "./";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 255, nullable: false })
  text: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn()
  sender!: User;

  @Column("integer", { nullable: false })
  @RelationId((message: Message) => message.sender)
  senderId: number;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @JoinColumn()
  receiver!: User;

  @Column("integer", { nullable: false })
  @RelationId((message: Message) => message.receiver)
  receiverId: number;

  @ManyToOne(() => Assignment, { nullable: false })
  @JoinColumn()
  assignment!: Assignment;

  @Column("integer", { nullable: false })
  @RelationId((message: Message) => message.assignment)
  assignmentId: number;

  @ManyToOne(() => File, { nullable: true })
  @JoinColumn()
  attachment: File;

  @RelationId((message: Message) => message.attachment)
  attachmentId: number;

  @Column("timestamp", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
