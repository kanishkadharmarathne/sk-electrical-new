import { DataSource } from "typeorm";
import { User} from "./entities/User";
import { Product } from "./entities/Product";
import {Cart} from "./entities/cart"
import { Order } from "./entities/Order";
import { CCTVPackage } from "./entities/CCTVPackage";
import { CCTVBooking } from "./entities/CCTVBooking";
import { ChatRoom } from "./entities/ChatRoom";
import { Message } from "./entities/Message";
import { ChatNotification } from "./entities/Notification";


export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.MONGODB_URI,
  database: process.env.MONGODB_DB || "SKdb",
  synchronize: process.env.NODE_ENV === "development", // Auto-create schema in dev
  logging: process.env.NODE_ENV === "development",
  entities: [User, Product, Cart, Order, CCTVPackage, CCTVBooking, ChatRoom, Message, ChatNotification],
//   useUnifiedTopology: true,
});

// Initialize connection
let isInitialized = false;

export const initializeDatabase = async () => {
  if (!isInitialized && !AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    isInitialized = true;
    console.log("✅ Database connected successfully");
  }
  return AppDataSource;
};