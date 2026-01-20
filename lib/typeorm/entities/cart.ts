import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export interface CartItemInterface {
  productId: string;
  productname: string;
  title: string;
  price: string;
  image: string;
  quantity: number;
  inStock: boolean;
}

@Entity("carts")
export class Cart {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ unique: true })
  userId!: string;

  @Column() // ✅ Simple @Column() works for MongoDB
  items!: CartItemInterface[];

  @Column({ default: 0 })
  totalItems!: number;

  @Column({ default: "0" })
  totalPrice!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Helper to get string ID
  get id(): string {
    return this._id.toString();
  }
}
