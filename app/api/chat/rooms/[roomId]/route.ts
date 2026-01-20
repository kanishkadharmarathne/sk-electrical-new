import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ChatRoomRepository } from "@/lib/typeorm/repositories/chatRepository";

// GET specific chat room
export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await params;

    const chatRoom = await ChatRoomRepository.getChatRoomById(roomId);

    if (!chatRoom) {
      return NextResponse.json(
        { error: "Chat room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ chatRoom });
  } catch (error) {
    console.error("Error fetching chat room:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat room" },
      { status: 500 }
    );
  }
}

// PUT update chat room status
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const chatRoom = await ChatRoomRepository.updateStatus(roomId, status);

    if (!chatRoom) {
      return NextResponse.json(
        { error: "Chat room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      chatRoom, 
      message: "Chat room updated" 
    });
  } catch (error) {
    console.error("Error updating chat room:", error);
    return NextResponse.json(
      { error: "Failed to update chat room" },
      { status: 500 }
    );
  }
}

// DELETE chat room
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await params;

    const deleted = await ChatRoomRepository.deleteChatRoom(roomId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Chat room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Chat room deleted" });
  } catch (error) {
    console.error("Error deleting chat room:", error);
    return NextResponse.json(
      { error: "Failed to delete chat room" },
      { status: 500 }
    );
  }
}