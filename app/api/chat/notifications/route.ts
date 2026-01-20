import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ChatNotificationRepository } from "@/lib/typeorm/repositories/chatNotificationRepository";

// GET technician's notifications
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await ChatNotificationRepository.getNotificationsForTechnician(
      session.user.email
    );

    const totalUnread = await ChatNotificationRepository.getTotalUnreadCount(
      session.user.email
    );

    return NextResponse.json({ 
      notifications, 
      totalUnread 
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// DELETE clear all notifications for technician
export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const count = await ChatNotificationRepository.markAllAsReadForTechnician(
      session.user.email
    );

    return NextResponse.json({ 
      count, 
      message: "All notifications marked as read" 
    });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    return NextResponse.json(
      { error: "Failed to clear notifications" },
      { status: 500 }
    );
  }
}