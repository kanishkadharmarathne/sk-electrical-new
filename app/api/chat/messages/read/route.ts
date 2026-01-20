import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { MessageRepository } from "@/lib/typeorm/repositories/messageRepository";
import { ChatNotificationRepository } from "@/lib/typeorm/repositories/chatNotificationRepository";

// POST mark messages as read
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { chatRoomId, userType } = body;

    if (!chatRoomId || !userType) {
      return NextResponse.json(
        { error: "Chat room ID and user type are required" },
        { status: 400 }
      );
    }

    let count = 0;

    if (userType === "customer") {
      count = await MessageRepository.markAllAsReadByCustomer(chatRoomId);
    } else if (userType === "technician") {
      count = await MessageRepository.markAllAsReadByTechnician(
        chatRoomId,
        session.user.email
      );
      
      // Reset notification count
      await ChatNotificationRepository.resetUnreadCount(
        session.user.email,
        chatRoomId
      );
    } else {
      return NextResponse.json(
        { error: "Invalid user type" },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      count, 
      message: `${count} messages marked as read` 
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}