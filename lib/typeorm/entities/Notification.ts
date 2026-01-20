import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  UpdateDateColumn,
} from "typeorm";

@Entity("chatnotifications")
export class ChatNotification {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  technicianId!: string; // Which technician this is for

  @Column()
  chatRoomId!: string; // Which chat room has unread messages

  @Column({ default: 0 })
  unreadCount!: number; // How many unread messages

  @Column()
  lastMessageAt!: Date; // When was the last message

  @UpdateDateColumn()
  updatedAt!: Date;

  get id(): string {
    return this._id.toString();
  }
}