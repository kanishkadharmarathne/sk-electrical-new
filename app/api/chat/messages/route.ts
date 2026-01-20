import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { MessageRepository } from "@/lib/typeorm/repositories/messageRepository";
import { ChatRoomRepository } from "@/lib/typeorm/repositories/chatRepository";
import { ChatNotificationRepository } from "@/lib/typeorm/repositories/chatNotificationRepository";

// GET messages for a chat room
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatRoomId = searchParams.get("chatRoomId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!chatRoomId) {
      return NextResponse.json(
        { error: "Chat room ID is required" },
        { status: 400 }
      );
    }

    const result = await MessageRepository.getMessagesPaginated(
      chatRoomId,
      page,
      limit
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST send a message
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { chatRoomId, content, senderType, senderName, attachmentUrl } = body;

    // Validate required fields
    if (!chatRoomId || !content || !senderType || !senderName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["customer", "technician"].includes(senderType)) {
      return NextResponse.json(
        { error: "Invalid sender type" },
        { status: 400 }
      );
    }

    // Create message
    const message = await MessageRepository.createMessage({
      chatRoomId,
      senderId: session.user.email,
      senderType,
      senderName,
      content,
      attachmentUrl,
    });

    // Update chat room's last message
    await ChatRoomRepository.updateLastMessage(
      chatRoomId,
      content,
      message.createdAt
    );

    // If customer sent message, increment unread for all technicians
    if (senderType === "customer") {
      // TODO: Get all technician IDs from your user repository
      const technicianIds: string[] = []; // Replace with actual technician IDs
      
      if (technicianIds.length > 0) {
        await ChatNotificationRepository.incrementUnreadForAllTechnicians(
          chatRoomId,
          technicianIds,
          message.createdAt
        );
      }
    }

    return NextResponse.json({ 
      message, 
    //   message: "Message sent successfully" 
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}