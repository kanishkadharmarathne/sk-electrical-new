import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

export interface OrderItemInterface {
  productId: string;
  productname: string;
  title: string;
  price: string;
  image: string;
  quantity: number;
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

@Entity("orders")
export class Order {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  userId!: string;

  @Column()
  items!: OrderItemInterface[];

  @Column()
  totalItems!: number;

  @Column()
  totalPrice!: string;

  @Column({ type: "varchar", enum: OrderStatus, default: OrderStatus.PENDING })
  orderStatus!: OrderStatus;

  @Column({ type: "varchar", enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus!: PaymentStatus;

  // Shipping Information
  @Column({ nullable: true })
  shippingAddress?: string;

  @Column({ nullable: true })
  shippingCity?: string;

  @Column({ nullable: true })
  shippingState?: string;

  @Column({ nullable: true })
  shippingZipCode?: string;

  @Column({ nullable: true })
  shippingCountry?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  // Payment Information
  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ nullable: true })
  transactionId?: string;

  // Order Tracking
  @Column({ nullable: true })
  trackingNumber?: string;

  @Column({ nullable: true })
  estimatedDelivery?: Date;

  @Column({ nullable: true })
  deliveredAt?: Date;

  // Notes
  @Column({ nullable: true })
  notes?: string;

  // Tax and Shipping
  @Column({ default: "0" })
  tax!: string;

  @Column({ default: "0" })
  shippingCost!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Helper to get string ID
  get id(): string {
    return this._id.toString();
  }
}