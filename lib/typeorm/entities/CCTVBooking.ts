import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity("cctv_bookings")
export class CCTVBooking {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  userId!: string;

  @Column()
  packageId!: string;

  @Column()
  packagename!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  // Address Information
  @Column()
  streetAddress!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  zipCode!: string;

  @Column()
  country!: string;

  @Column({ nullable: true })
  landmark?: string;

  // Installation Details
  @Column()
  preferredDate!: Date;

  @Column()
  preferredTime!: string; // e.g., "09:00-12:00", "14:00-17:00"

  @Column()
  vehicleAccess!: boolean;

  @Column({ nullable: true })
  vehicleAccessDetails?: string; // e.g., "Narrow gate, requires small vehicle"

  @Column({ nullable: true })
  accessInstructions?: string; // e.g., "Ring doorbell twice"

  // Additional Information
  @Column({ nullable: true })
  cableManagement?: string; // e.g., "Wall-mounted", "Hidden in walls"

  @Column({ nullable: true })
  internetConnection?: boolean;

  @Column({ nullable: true })
  powerAvailability?: string; // e.g., "Multiple outlets available"

  @Column({ nullable: true })
  specialRequirements?: string; // Any special requests

  @Column({ nullable: true })
  alternatePhone?: string;

  // Booking Status
  @Column({ type: "varchar", enum: BookingStatus, default: BookingStatus.PENDING })
  bookingStatus!: BookingStatus;

  @Column({ default: "0" })
  totalPrice!: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  estimatedCompletionDate?: Date;

  @Column({ nullable: true })
  technician?: string;

  @Column({ nullable: true })
  technicianPhone?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  get id(): string {
    return this._id.toString();
  }
}