import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("products")
export class Product {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  productname!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  price!: string;

  @Column()
  image!: string;

  @Column()
  category!: string;

  @Column({ default: 0 })
  colors!: number;

  @Column({ default: 0 })
  rating!: number;

  @Column({ default: true })
  inStock!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Helper to get string ID
  get id(): string {
    return this._id.toString();
  }
}