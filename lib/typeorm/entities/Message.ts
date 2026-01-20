import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export interface MessageReadStatus {
  technicianId: string;
  readAt: Date;
}

@Entity("messages")
export class Message {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  chatRoomId!: string; // Links to ChatRoom

  @Column()
  senderId!: string; // userId of sender

  @Column()
  senderType!: "customer" | "technician"; // Who sent it

  @Column()
  senderName!: string; // Display name

  @Column()
  content!: string; // The actual message text

  @Column({ nullable: true })
  attachmentUrl?: string; // Optional: for images/files

  @Column({ default: false })
  isRead!: boolean; // Has customer read it (if sent by technician)

  @Column({ type: "array", default: [] })
  readBy!: MessageReadStatus[]; // Which technicians have read it

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  get id(): string {
    return this._id.toString();
  }
}
