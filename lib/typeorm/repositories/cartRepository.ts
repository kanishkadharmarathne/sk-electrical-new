import { AppDataSource, initializeDatabase } from "../config";
import { Cart, CartItemInterface } from "../entities/cart";
import { ObjectId } from "mongodb";

export class CartRepository {
  static async getRepository() {
    const dataSource = await initializeDatabase();
    return dataSource.getMongoRepository(Cart);
  }

  // Get or create cart for user
  static async getOrCreateCart(userId: string): Promise<Cart> {
    const repo = await this.getRepository();
    let cart = await repo.findOne({ where: { userId } as any });

    if (!cart) {
      cart = repo.create({
        userId,
        items: [],
        totalItems: 0,
        totalPrice: "0",
      });
      await repo.save(cart);
    }

    return cart;
  }

  // Add item to cart
  static async addItem(
    userId: string,
    item: CartItemInterface
  ): Promise<Cart> {
    const repo = await this.getRepository();
    const cart = await this.getOrCreateCart(userId);

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (i) => i.productId === item.productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      cart.items.push(item);
    }

    // Recalculate totals
    cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.totalPrice = cart.items
      .reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0)
      .toFixed(2);

    await repo.save(cart);
    return cart;
  }

  // Update item quantity
  static async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<Cart | null> {
    const repo = await this.getRepository();
    const cart = await this.getOrCreateCart(userId);

    const itemIndex = cart.items.findIndex((i) => i.productId === productId);

    if (itemIndex === -1) {
      return null;
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate totals
    cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.totalPrice = cart.items
      .reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0)
      .toFixed(2);

    await repo.save(cart);
    return cart;
  }

  // Remove item from cart
  static async removeItem(userId: string, productId: string): Promise<Cart> {
    const repo = await this.getRepository();
    const cart = await this.getOrCreateCart(userId);

    cart.items = cart.items.filter((i) => i.productId !== productId);

    // Recalculate totals
    cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.totalPrice = cart.items
      .reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0)
      .toFixed(2);

    await repo.save(cart);
    return cart;
  }

  // Clear cart
  static async clearCart(userId: string): Promise<Cart> {
    const repo = await this.getRepository();
    const cart = await this.getOrCreateCart(userId);

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = "0";

    await repo.save(cart);
    return cart;
  }

  // Get cart by userId
  static async getCartByUserId(userId: string): Promise<Cart | null> {
    const repo = await this.getRepository();
    return repo.findOne({ where: { userId } as any });
  }
}