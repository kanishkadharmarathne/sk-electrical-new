import { initializeDatabase } from "../config";
import { ChatNotification } from "../entities/Notification";

export class ChatNotificationRepository {
  static async getRepository() {
    const dataSource = await initializeDatabase();
    return dataSource.getMongoRepository(ChatNotification);
  }

  // Get or create notification record for technician
  static async getOrCreateNotification(
    technicianId: string,
    chatRoomId: string
  ): Promise<ChatNotification> {
    const repo = await this.getRepository();
    let notification = await repo.findOne({
      where: { technicianId, chatRoomId } as any,
    });

    if (!notification) {
      notification = repo.create({
        technicianId,
        chatRoomId,
        unreadCount: 0,
        lastMessageAt: new Date(),
      });
      await repo.save(notification);
    }

    return notification;
  }

  // Increment unread count for all technicians
  static async incrementUnreadForAllTechnicians(
    chatRoomId: string,
    technicianIds: string[],
    lastMessageAt: Date
  ): Promise<void> {
    const repo = await this.getRepository();

    for (const technicianId of technicianIds) {
      const notification = await this.getOrCreateNotification(
        technicianId,
        chatRoomId
      );
      notification.unreadCount += 1;
      notification.lastMessageAt = lastMessageAt;
      await repo.save(notification);
    }
  }

  // Reset unread count for specific technician
  static async resetUnreadCount(
    technicianId: string,
    chatRoomId: string
  ): Promise<ChatNotification | null> {
    const repo = await this.getRepository();
    const notification = await repo.findOne({
      where: { technicianId, chatRoomId } as any,
    });

    if (!notification) {
      return null;
    }

    notification.unreadCount = 0;
    await repo.save(notification);
    return notification;
  }

  // Get all notifications for a technician
  static async getNotificationsForTechnician(
    technicianId: string
  ): Promise<ChatNotification[]> {
    const repo = await this.getRepository();
    return repo.find({
      where: { technicianId } as any,
      order: { lastMessageAt: "DESC" } as any,
    });
  }

  // Get notifications with unread messages for technician
  static async getUnreadNotificationsForTechnician(
    technicianId: string
  ): Promise<ChatNotification[]> {
    const repo = await this.getRepository();
    const notifications = await repo.find({
      where: { technicianId } as any,
      order: { lastMessageAt: "DESC" } as any,
    });

    return notifications.filter((n) => n.unreadCount > 0);
  }

  // Get total unread count for technician
  static async getTotalUnreadCount(technicianId: string): Promise<number> {
    const repo = await this.getRepository();
    const notifications = await repo.find({
      where: { technicianId } as any,
    });

    return notifications.reduce((sum, n) => sum + n.unreadCount, 0);
  }

  // Get notification for specific chat room and technician
  static async getNotification(
    technicianId: string,
    chatRoomId: string
  ): Promise<ChatNotification | null> {
    const repo = await this.getRepository();
    return repo.findOne({
      where: { technicianId, chatRoomId } as any,
    });
  }

  // Update last message time
  static async updateLastMessageTime(
    technicianId: string,
    chatRoomId: string,
    lastMessageAt: Date
  ): Promise<ChatNotification | null> {
    const repo = await this.getRepository();
    const notification = await this.getOrCreateNotification(
      technicianId,
      chatRoomId
    );

    notification.lastMessageAt = lastMessageAt;
    await repo.save(notification);
    return notification;
  }

  // Delete notification
  static async deleteNotification(
    technicianId: string,
    chatRoomId: string
  ): Promise<boolean> {
    const repo = await this.getRepository();
    const result = await repo.delete({ technicianId, chatRoomId } as any);
    return (result.affected || 0) > 0;;
  }

  // Delete all notifications for a chat room
  static async deleteNotificationsByChatRoom(chatRoomId: string): Promise<number> {
    const repo = await this.getRepository();
    const result = await repo.delete({ chatRoomId } as any);
    return result.affected || 0;
  }

  // Delete all notifications for a technician
  static async deleteNotificationsByTechnician(
    technicianId: string
  ): Promise<number> {
    const repo = await this.getRepository();
    const result = await repo.delete({ technicianId } as any);
    return result.affected || 0;
  }

  // Mark all as read for technician
  static async markAllAsReadForTechnician(
    technicianId: string
  ): Promise<number> {
    const repo = await this.getRepository();
    const notifications = await repo.find({
      where: { technicianId } as any,
    });

    let count = 0;
    for (const notification of notifications) {
      if (notification.unreadCount > 0) {
        notification.unreadCount = 0;
        await repo.save(notification);
        count++;
      }
    }

    return count;
  }
}