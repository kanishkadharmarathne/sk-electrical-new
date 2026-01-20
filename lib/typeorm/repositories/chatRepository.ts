import { initializeDatabase } from "../config";
import { ChatRoom } from "../entities/ChatRoom";

export class ChatRoomRepository {
  static async getRepository() {
    const dataSource = await initializeDatabase();
    return dataSource.getMongoRepository(ChatRoom);
  }

  // Get or create chat room for customer
  static async getOrCreateChatRoom(
    customerId: string,
    customerName: string
  ): Promise<ChatRoom> {
    const repo = await this.getRepository();
    let chatRoom = await repo.findOne({ where: { customerId } as any });

    if (!chatRoom) {
      chatRoom = repo.create({
        customerId,
        customerName,
        status: "active",
        lastMessageAt: new Date(),
        lastMessage: "",
      });
      await repo.save(chatRoom);
    }

    return chatRoom;
  }

  // Get all active chat rooms (for technician dashboard)
  static async getAllActiveChatRooms(): Promise<ChatRoom[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: { status: "active" } as any,
      order: { lastMessageAt: "DESC" } as any,
    });
  }

  // Get all chat rooms with pagination
  static async getAllChatRooms(
    page: number = 1,
    limit: number = 20
  ): Promise<{ chatRooms: ChatRoom[]; total: number }> {
    const repo = await this.getRepository();
    const skip = (page - 1) * limit;

    const [chatRooms, total] = await repo.findAndCount({
      order: { lastMessageAt: "DESC" } as any,
      skip,
      take: limit,
    });

    return { chatRooms, total };
  }

  // Get chat room by ID
  static async getChatRoomById(chatRoomId: string): Promise<ChatRoom | null> {
    const repo = await this.getRepository();
    return repo.findOne({ where: { _id: chatRoomId } as any });
  }

  // Get chat room by customer ID
  static async getChatRoomByCustomerId(
    customerId: string
  ): Promise<ChatRoom | null> {
    const repo = await this.getRepository();
    return repo.findOne({ where: { customerId } as any });
  }

  // Update last message details
  static async updateLastMessage(
    chatRoomId: string,
    lastMessage: string,
    lastMessageAt: Date
  ): Promise<ChatRoom | null> {
    const repo = await this.getRepository();
    const chatRoom = await repo.findOne({ where: { _id: chatRoomId } as any });

    if (!chatRoom) {
      return null;
    }

    chatRoom.lastMessage = lastMessage;
    chatRoom.lastMessageAt = lastMessageAt;

    await repo.save(chatRoom);
    return chatRoom;
  }

  // Update chat room status
  static async updateStatus(
    chatRoomId: string,
    status: string
  ): Promise<ChatRoom | null> {
    const repo = await this.getRepository();
    const chatRoom = await repo.findOne({ where: { _id: chatRoomId } as any });

    if (!chatRoom) {
      return null;
    }

    chatRoom.status = status;
    await repo.save(chatRoom);
    return chatRoom;
  }

  // Close chat room
  static async closeChatRoom(chatRoomId: string): Promise<ChatRoom | null> {
    return this.updateStatus(chatRoomId, "closed");
  }

  // Reopen chat room
  static async reopenChatRoom(chatRoomId: string): Promise<ChatRoom | null> {
    return this.updateStatus(chatRoomId, "active");
  }

  // Search chat rooms by customer name
  static async searchByCustomerName(customerName: string): Promise<ChatRoom[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: {
        customerName: { $regex: customerName, $options: "i" } as any,
      } as any,
      order: { lastMessageAt: "DESC" } as any,
    });
  }

  // Get chat rooms by status
  static async getChatRoomsByStatus(status: string): Promise<ChatRoom[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: { status } as any,
      order: { lastMessageAt: "DESC" } as any,
    });
  }

  // Delete chat room (soft delete by changing status)
  static async deleteChatRoom(chatRoomId: string): Promise<boolean> {
    const repo = await this.getRepository();
    const result = await repo.delete({ _id: chatRoomId } as any);
    return (result.affected || 0) > 0;
  }
}