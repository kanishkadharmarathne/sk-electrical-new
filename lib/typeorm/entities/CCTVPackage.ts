import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export interface PackageProduct {
  productId: string;
  productname: string;
  title: string;
  price: string;
  quantity: number;
  description?: string;
}

@Entity("cctv_packages")
export class CCTVPackage {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  packagename!: string;

  @Column()
  description!: string;

  @Column()
  shortDescription!: string;

  @Column()
  image!: string;

  @Column()
  coverImage!: string;

  @Column()
  price!: string;

  @Column()
  products!: PackageProduct[];

  @Column()
  cameras!: number;

  @Column()
  installationDays!: number;

  @Column()
  warranty!: string;

  @Column()
  features!: string[];

  @Column()
  coverage!: string;

  @Column({ default: true })
  isAvailable!: boolean;

  @Column({ default: 0 })
  rating!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  get id(): string {
    return this._id.toString();
  }
}