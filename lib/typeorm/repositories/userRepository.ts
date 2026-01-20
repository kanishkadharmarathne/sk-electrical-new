import { AppDataSource, initializeDatabase } from "../config";
import { User } from "../entities/User";

export class UserRepository {
  static async getRepository() {
    const dataSource = await initializeDatabase();
    return dataSource.getMongoRepository(User);
  }

  static async findByEmail(email: string): Promise<User | null> {
    const repo = await this.getRepository();
    return repo.findOne({ where: { email } as any });
  }

  static async findByGoogleId(googleId: string): Promise<User | null> {
    const repo = await this.getRepository();
    return repo.findOne({ where: { googleId } as any });
  }

  static async createUser(userData: Partial<User>): Promise<User> {
    const repo = await this.getRepository();
    const user = repo.create(userData);
    return repo.save(user);
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const repo = await this.getRepository();
    const { ObjectId } = require("mongodb");
    
    await repo.update(new ObjectId(id), userData as any);
    return repo.findOne({ where: { _id: new ObjectId(id) } as any });
  }
}