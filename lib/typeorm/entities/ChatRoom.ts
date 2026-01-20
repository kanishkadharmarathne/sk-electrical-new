import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

// ============================================
// 1. CHAT ROOM ENTITY
// ============================================
// Each customer gets one chat room that all technicians can access

@Entity("chatrooms")
export class ChatRoom {
  @ObjectIdColumn()
  _id!: ObjectId;

  // @Column({ unique: true })
  // userId!: string;

  @Column({ unique: true })
  customerId!: string; // The customer who owns this chat room

  @Column()
  customerName!: string; // For display purposes

  @Column({ default: "active" }) // active, closed, pending
  status!: string;

  @Column({ nullable: true })
  lastMessageAt?: Date; // For sorting rooms by recent activity

  @Column({ nullable: true })
  lastMessage?: string; // Preview of last message

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  get id(): string {
    return this._id.toString();
  }
}