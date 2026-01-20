import { initializeDatabase } from "../config";
import { Message, MessageReadStatus } from "../entities/Message";

export interface CreateMessageDTO {
  chatRoomId: string;
  senderId: string;
  senderType: "customer" | "technician";
  senderName: string;
  content: string;
  attachmentUrl?: string;
}

export class MessageRepository {
  static async getRepository() {
    const dataSource = await initializeDatabase();
    return dataSource.getMongoRepository(Message);
  }

  // Create a new message
  static async createMessage(data: CreateMessageDTO): Promise<Message> {
    const repo = await this.getRepository();
    const message = repo.create({
      chatRoomId: data.chatRoomId,
      senderId: data.senderId,
      senderType: data.senderType,
      senderName: data.senderName,
      content: data.content,
      attachmentUrl: data.attachmentUrl,
      isRead: false,
      readBy: [],
    });

    await repo.save(message);
    return message;
  }

  // Get all messages for a chat room
  static async getMessagesByChatRoom(
    chatRoomId: string,
    limit: number = 50
  ): Promise<Message[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: { chatRoomId } as any,
      order: { createdAt: "ASC" } as any,
      take: limit,
    });
  }

  // Get paginated messages for a chat room
  static async getMessagesPaginated(
    chatRoomId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ messages: Message[]; total: number }> {
    const repo = await this.getRepository();
    const skip = (page - 1) * limit;

    const [messages, total] = await repo.findAndCount({
      where: { chatRoomId } as any,
      order: { createdAt: "DESC" } as any,
      skip,
      take: limit,
    });

    // Reverse to show oldest first
    return { messages: messages.reverse(), total };
  }

  // Get unread messages for customer in a chat room
  static async getUnreadMessagesForCustomer(
    chatRoomId: string
  ): Promise<Message[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: {
        chatRoomId,
        senderType: "technician",
        isRead: false,
      } as any,
      order: { createdAt: "ASC" } as any,
    });
  }

  // Get unread messages count for customer
  static async getUnreadCountForCustomer(chatRoomId: string): Promise<number> {
    const repo = await this.getRepository();
    return repo.count({
      where: {
        chatRoomId,
        senderType: "technician",
        isRead: false,
      } as any,
    });
  }

  // Get messages not read by specific technician
  static async getUnreadMessagesForTechnician(
    chatRoomId: string,
    technicianId: string
  ): Promise<Message[]> {
    const repo = await this.getRepository();
    const messages = await repo.find({
      where: {
        chatRoomId,
        senderType: "customer",
      } as any,
      order: { createdAt: "ASC" } as any,
    });

    // Filter messages not read by this technician
    return messages.filter(
      (msg) => !msg.readBy.some((read) => read.technicianId === technicianId)
    );
  }

  // Mark message as read by customer
  static async markAsReadByCustomer(messageId: string): Promise<Message | null> {
    const repo = await this.getRepository();
    const message = await repo.findOne({ where: { _id: messageId } as any });

    if (!message) {
      return null;
    }

    message.isRead = true;
    await repo.save(message);
    return message;
  }

  // Mark all messages in chat room as read by customer
  static async markAllAsReadByCustomer(chatRoomId: string): Promise<number> {
    const repo = await this.getRepository();
    const messages = await repo.find({
      where: {
        chatRoomId,
        senderType: "technician",
        isRead: false,
      } as any,
    });

    for (const message of messages) {
      message.isRead = true;
      await repo.save(message);
    }

    return messages.length;
  }

  // Mark message as read by technician
  static async markAsReadByTechnician(
    messageId: string,
    technicianId: string
  ): Promise<Message | null> {
    const repo = await this.getRepository();
    const message = await repo.findOne({ where: { _id: messageId } as any });

    if (!message) {
      return null;
    }

    // Check if already marked as read by this technician
    const alreadyRead = message.readBy.some(
      (read) => read.technicianId === technicianId
    );

    if (!alreadyRead) {
      message.readBy.push({
        technicianId,
        readAt: new Date(),
      });
      await repo.save(message);
    }

    return message;
  }

  // Mark all messages in chat room as read by technician
  static async markAllAsReadByTechnician(
    chatRoomId: string,
    technicianId: string
  ): Promise<number> {
    const repo = await this.getRepository();
    const messages = await repo.find({
      where: {
        chatRoomId,
        senderType: "customer",
      } as any,
    });

    let count = 0;
    for (const message of messages) {
      const alreadyRead = message.readBy.some(
        (read) => read.technicianId === technicianId
      );

      if (!alreadyRead) {
        message.readBy.push({
          technicianId,
          readAt: new Date(),
        });
        await repo.save(message);
        count++;
      }
    }

    return count;
  }

  // Get latest message in a chat room
  static async getLatestMessage(chatRoomId: string): Promise<Message | null> {
    const repo = await this.getRepository();
    const messages = await repo.find({
      where: { chatRoomId } as any,
      order: { createdAt: "DESC" } as any,
      take: 1,
    });

    return messages.length > 0 ? messages[0] : null;
  }

  // Delete message
  static async deleteMessage(messageId: string): Promise<boolean> {
    const repo = await this.getRepository();
    const result = await repo.delete({ _id: messageId } as any);
    return (result.affected || 0) > 0;
  }

  // Delete all messages in a chat room
  static async deleteAllMessagesInChatRoom(chatRoomId: string): Promise<number> {
    const repo = await this.getRepository();
    const result = await repo.delete({ chatRoomId } as any);
    return result.affected || 0;
  }

  // Get message by ID
  static async getMessageById(messageId: string): Promise<Message | null> {
    const repo = await this.getRepository();
    return repo.findOne({ where: { _id: messageId } as any });
  }
}