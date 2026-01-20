import { AppDataSource, initializeDatabase } from "../config";
import { Product } from "../entities/Product";
import { ObjectId } from "mongodb";

export class ProductRepository {
  static async getRepository() {
    const dataSource = await initializeDatabase();
    return dataSource.getMongoRepository(Product);
  }

  static async findAll(): Promise<Product[]> {
    const repo = await this.getRepository();
    return repo.find();
  }

  //need to get camera products only
  static async findTopFour(): Promise<Product[]> {
    const repo = await this.getRepository();
    return repo.find({ where: { category: "Camera" } as any, take: 4 });
  }

  static async findById(id: string): Promise<Product | null> {
    if (!ObjectId.isValid(id)) {
      console.error("❌ Invalid ObjectId:", id);
      return null;
    }

    const repo = await this.getRepository();
    return repo.findOne({ where: { _id: new ObjectId(id) } as any });
  }

  static async searchProducts(query: string): Promise<Product[]> {
    const repo = await this.getRepository();

    // Search in productname, title, description, and category
    const products = await repo.find();

    if (!query) return products;

    const searchQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.category.toLowerCase().includes(searchQuery)
    );
  }

  static async findByCategory(category: string): Promise<Product[]> {
    const repo = await this.getRepository();
    const products = await repo.find();
    return products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  static async createProduct(productData: Partial<Product>): Promise<Product> {
    const repo = await this.getRepository();
    const product = repo.create(productData);
    return repo.save(product);
  }

  static async updateProduct(
    id: string,
    productData: Partial<Product>
  ): Promise<Product | null> {
    const repo = await this.getRepository();
    await repo.update(new ObjectId(id), productData as any);
    return repo.findOne({ where: { _id: new ObjectId(id) } as any });
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const repo = await this.getRepository();
    const result = await repo.delete(new ObjectId(id));
    return (
      result.raw?.deleteCount !== undefined && result.raw?.deletedCount > 0
    );
  }
}
