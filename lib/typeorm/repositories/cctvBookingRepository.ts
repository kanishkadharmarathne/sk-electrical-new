import { AppDataSource, initializeDatabase } from "../config";
import { CCTVBooking, BookingStatus } from "../entities/CCTVBooking";
import { ObjectId } from "mongodb";
import { CCTVPackage } from "../entities/CCTVPackage";

export interface CreateBookingData {
  userId: string;
  packageId: string;
  packagename: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark?: string;
  preferredDate: Date;
  preferredTime: string;
  vehicleAccess: boolean;
  vehicleAccessDetails?: string;
  accessInstructions?: string;
  cableManagement?: string;
  internetConnection?: boolean;
  powerAvailability?: string;
  specialRequirements?: string;
  alternatePhone?: string;
  technician?: string;
  technicianPhone?: string;
  estimatedCompletionDate?: Date;
  notes?: string;
  totalPrice: string;
}

export class CCTVBookingRepository {
  static async getRepository() {
    const dataSource = await initializeDatabase();
    return dataSource.getMongoRepository(CCTVBooking);
  }

  // Create booking
  static async createBooking(bookingData: CreateBookingData): Promise<CCTVBooking> {
    const repo = await this.getRepository();

    const booking = repo.create({
      ...bookingData,
      bookingStatus: BookingStatus.PENDING,
    });

    await repo.save(booking);
    return booking;
  }

  // Get booking by ID
  static async getBookingById(bookingId: string): Promise<CCTVBooking | null> {
    const repo = await this.getRepository();
    return repo.findOne({
      where: { _id: new ObjectId(bookingId) } as any,
    });
  }

  // Get all bookings for user
  static async getBookingsByUserId(userId: string): Promise<CCTVBooking[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: { userId } as any,
      order: { createdAt: "DESC" } as any,
    });
  }

  // Get all bookings (admin)
  static async getAllBookings(): Promise<CCTVBooking[]> {
    const repo = await this.getRepository();
    return repo.find({
      order: { createdAt: "DESC" } as any,
    });
  }

  // Update booking
  static async updateBooking(
    bookingId: string,
    updateData: Partial<CreateBookingData> & { bookingStatus?: BookingStatus }
  ): Promise<CCTVBooking | null> {
    const repo = await this.getRepository();

    await repo.update(new ObjectId(bookingId), updateData as any);

    return repo.findOne({
      where: { _id: new ObjectId(bookingId) } as any,
    });
  }

  // Get bookings by status
  static async getBookingsByStatus(status: BookingStatus): Promise<CCTVBooking[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: { bookingStatus: status } as any,
      order: { createdAt: "DESC" } as any,
    });
  }

  // Delete booking
  static async deleteBooking(bookingId: string): Promise<boolean> {
    const repo = await this.getRepository();
    const result = await repo.delete(new ObjectId(bookingId));
    return (result.affected || 0) > 0;
  }

  // Get bookings by date range
  static async getBookingsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<CCTVBooking[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: {
        preferredDate: {
          $gte: startDate,
          $lte: endDate,
        },
      } as any,
    });
  }

  // Get admin statistics
  static async getAdminStats() {
    const bookings = await this.getAllBookings();

    const totalBookings = bookings.length;
    const totalRevenue = bookings
      .reduce((sum, booking) => sum + parseFloat(booking.totalPrice), 0)
      .toFixed(2);

    const pendingBookings = bookings.filter(
      (b) => b.bookingStatus === BookingStatus.PENDING
    ).length;

    const completedBookings = bookings.filter(
      (b) => b.bookingStatus === BookingStatus.COMPLETED
    ).length;

    return {
      totalBookings,
      totalRevenue,
      pendingBookings,
      completedBookings,
    };
  }
  
  // Get bookings for dashboard
  static async getUpcomingBookings(days: number = 7): Promise<CCTVBooking[]> {
    const repo = await this.getRepository();
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return repo.find({
      where: {
        preferredDate: {
          $gte: now,
          $lte: futureDate,
        },
        bookingStatus: {
          $in: [
            BookingStatus.CONFIRMED,
            BookingStatus.SCHEDULED,
            BookingStatus.IN_PROGRESS,
          ],
        },
      } as any,
      order: { preferredDate: "ASC" } as any,
    });
  }

   // Get bookings for technician
  static async getBookingsByTechnician(
    technicianName: string
  ): Promise<CCTVBooking[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: { technician: technicianName } as any,
      order: { preferredDate: "DESC" } as any,
    });
  }

  // Get pending confirmations (bookings that need to be confirmed)
  static async getPendingConfirmations(): Promise<CCTVBooking[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: { bookingStatus: BookingStatus.PENDING } as any,
      order: { createdAt: "DESC" } as any,
    });
  }
  
}
