import { AppDataSource, initializeDatabase } from "../config";
import { CCTVPackage, PackageProduct } from "../entities/CCTVPackage";
import { ObjectId } from "mongodb";

export interface CreatePackageData {
  packagename: string;
  description: string;
  shortDescription: string;
  image: string;
  coverImage: string;
  price: string;
  products: PackageProduct[];
  cameras: number;
  installationDays: number;
  warranty: string;
  features: string[];
  coverage: string;
}

export class CCTVPackageRepository {
  static async getRepository() {
    const dataSource = await initializeDatabase();
    return dataSource.getMongoRepository(CCTVPackage);
  }

  // Get all packages
  static async getAllPackages(): Promise<CCTVPackage[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: { isAvailable: true } as any,
      order: { createdAt: "DESC" } as any,
    });
  }

  //find top3 packages
  static async findTopThree(): Promise<CCTVPackage[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: { isAvailable: true } as any,
      take: 3,
      order: { createdAt: "DESC" } as any,
    });
  }

  // Get single package by ID
  static async getPackageById(packageId: string): Promise<CCTVPackage | null> {
    const repo = await this.getRepository();
    return repo.findOne({
      where: { _id: new ObjectId(packageId) } as any,
    });
  }

  // Create new package
  static async createPackage(
    packageData: CreatePackageData
  ): Promise<CCTVPackage> {
    const repo = await this.getRepository();

    const newPackage = repo.create({
      ...packageData,
      rating: 0,
    });

    await repo.save(newPackage);
    return newPackage;
  }

  // Update package
  static async updatePackage(
    packageId: string,
    updateData: Partial<CreatePackageData>
  ): Promise<CCTVPackage | null> {
    const repo = await this.getRepository();

    await repo.update(new ObjectId(packageId), updateData as any);

    return repo.findOne({
      where: { _id: new ObjectId(packageId) } as any,
    });
  }

  // Delete package
  static async deletePackage(packageId: string): Promise<boolean> {
    const repo = await this.getRepository();
    const result = await repo.delete(new ObjectId(packageId));
    return (result.affected || 0) > 0;
  }

  // Get packages by camera count
  static async getPackagesByCamera(cameras: number): Promise<CCTVPackage[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: { cameras, isAvailable: true } as any,
    });
  }

  // Search packages
  static async searchPackages(query: string): Promise<CCTVPackage[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: {
        $or: [
          { packagename: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
        isAvailable: true,
      } as any,
    });
  }
}