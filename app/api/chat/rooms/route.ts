import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ChatRoomRepository } from "@/lib/typeorm/repositories/chatRepository";
import { MessageRepository } from "@/lib/typeorm/repositories/messageRepository";
import { UserRepository } from "@/lib/typeorm/repositories/userRepository";

// GET all chat rooms (for technician dashboard)
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Optional: Check if user is technician
    // if (session.user.role !== "technician") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");

    let chatRooms;
    
    if (status) {
      chatRooms = await ChatRoomRepository.getChatRoomsByStatus(status);
    } else {
      const result = await ChatRoomRepository.getAllChatRooms(page, limit);
      return NextResponse.json(result);
    }

    return NextResponse.json({ chatRooms });
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat rooms" },
      { status: 500 }
    );
  }
}

// POST create or get customer's chat room
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { customerName } = body;

    if (!customerName) {
      return NextResponse.json(
        { error: "Customer name is required" },
        { status: 400 }
      );
    }

    const user = await UserRepository.findByEmail(session.user.email);
    console.log("USER FOUND:", user);

    const chatRoom = await ChatRoomRepository.getOrCreateChatRoom(
      session.user.email,
      user?.name || customerName
    );

    return NextResponse.json({ 
      chatRoom, 
      message: "Chat room created" 
    });
  } catch (error) {
    console.error("Error creating chat room:", error);
    return NextResponse.json(
      { error: "Failed to create chat room" },
      { status: 500 }
    );
  }
}