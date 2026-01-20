"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";

interface ChatRoom {
  _id: string;
  customerName: string;
  customerId: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

interface Message {
  _id: string;
  senderType: string;
  senderName: string;
  content: string;
  createdAt: string;
}

interface Notification {
  chatRoomId: string;
  unreadCount: number;
}

export default function TechnicianDashboard() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Sort rooms: unread messages first, then most recent lastMessageAt
  const sortRooms = (rooms: ChatRoom[]) => {
    return [...rooms].sort((a, b) => {
      const aUnread =
        notifications.find((n) => n.chatRoomId === a._id)?.unreadCount || 0;
      const bUnread =
        notifications.find((n) => n.chatRoomId === b._id)?.unreadCount || 0;
      if (aUnread !== bUnread) return bUnread - aUnread;

      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime;
    });
  };

  // Auto-scroll to bottom
  //   const scrollToBottom = () => {
  //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //   };

  useEffect(() => {
    // scrollToBottom();
  }, [messages]);

  // Initialize on mount
  useEffect(() => {
    fetchChatRooms();
    fetchNotifications();

    // Poll for updates every 3 seconds
    const interval = setInterval(() => {
      fetchChatRooms();
      fetchNotifications();
      if (selectedRoom) {
        fetchMessages(selectedRoom._id);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedRoom]);

  // Fetch all chat rooms
  const fetchChatRooms = async () => {
    try {
      const response = await fetch("/api/chat/rooms?status=active");
      if (!response.ok) throw new Error("Failed to fetch chat rooms");

      const data = await response.json();
      const rooms: ChatRoom[] = data.chatRooms || [];

      // Enrich rooms with the latest message/time when available
      const enriched = await Promise.all(
        rooms.map(async (room) => {
          try {
            const res = await fetch(
              `/api/chat/messages?chatRoomId=${room._id}&limit=1&sort=desc`
            );
            if (!res.ok) return room;
            const d = await res.json();
            const lastMsg = (d.messages && d.messages[0]) || null;
            if (lastMsg) {
              return {
                ...room,
                lastMessage: lastMsg.content || room.lastMessage,
                lastMessageAt: lastMsg.createdAt || room.lastMessageAt,
              } as ChatRoom;
            }
            return room;
          } catch (e) {
            return room;
          }
        })
      );

      setChatRooms(sortRooms(enriched));
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/chat/notifications");
      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();
      const notifs = data.notifications || [];
      setNotifications(notifs);
      setTotalUnread(data.totalUnread || 0);

      // Re-sort existing chatRooms so rooms with unread messages move to top
      setChatRooms((prev) => sortRooms(prev));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch messages for selected room
  const fetchMessages = async (roomId: string): Promise<void> => {
    try {
      const response = await fetch(
        `/api/chat/messages?chatRoomId=${roomId}&limit=100`
      );
      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Select a chat room
  const handleSelectRoom = async (room: ChatRoom): Promise<void> => {
    setSelectedRoom(room);
    await fetchMessages(room._id);

    // Mark messages as read
    await markMessagesAsRead(room._id);
  };

  // Mark messages as read
  const markMessagesAsRead = async (roomId: string): Promise<void> => {
    try {
      await fetch("/api/chat/messages/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatRoomId: roomId,
          userType: "technician",
        }),
      });

      // Refresh notifications
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Send message
  const handleSendMessage = async (): Promise<void> => {
    if (!newMessage.trim() || !selectedRoom || sending) return;

    setSending(true);
    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatRoomId: selectedRoom._id,
          content: newMessage,
          senderType: "technician",
          senderName: "Technician",
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setNewMessage("");
      await fetchMessages(selectedRoom._id);
      await fetchChatRooms();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e as any).key === "Enter" && !(e as any).shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Close chat room
  const handleCloseRoom = async (roomId: string): Promise<void> => {
    if (!confirm("Are you sure you want to close this chat?")) return;

    try {
      const response = await fetch(`/api/chat/rooms/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });

      if (!response.ok) throw new Error("Failed to close chat room");

      await fetchChatRooms();
      if (selectedRoom?._id === roomId) {
        setSelectedRoom(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error closing chat room:", error);
      alert("Failed to close chat room.");
    }
  };

  // Format timestamp
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date
  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get unread count for a room
  const getUnreadCount = (roomId: string) => {
    const notification = notifications.find((n) => n.chatRoomId === roomId);
    return notification?.unreadCount || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex h-165 bg-gray-100">
      {/* Sidebar - Chat Rooms List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <h1 className="text-xl font-bold text-white">Customer Chats</h1>
          {totalUnread > 0 && (
            <div className="mt-2 flex items-center gap-2 text-white text-sm">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span>{totalUnread} unread messages</span>
            </div>
          )}
        </div>

        {/* Chat Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {chatRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <svg
                className="w-16 h-16 mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <p className="text-sm text-center">No active chats</p>
              <p className="text-xs text-gray-400 mt-1">
                Waiting for customer messages
              </p>
            </div>
          ) : (
            chatRooms.map((room) => {
              const unreadCount = getUnreadCount(room._id);
              const isSelected = selectedRoom?._id === room._id;

              return (
                <div
                  key={room._id}
                  onClick={() => handleSelectRoom(room)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {room.customerName}
                          {totalUnread > 0 && " 🟢"}
                        </h3>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {room.lastMessageAt
                          ? new Date(room.lastMessageAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : " "}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {room.lastMessageAt
                          ? formatDate(room.lastMessageAt)
                          : ""}
                      </p>
                    </div>
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseRoom(room._id);
                      }}
                      className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Close chat"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button> */}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {selectedRoom.customerName}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Customer Email: {selectedRoom.customerId}
                    </p>
                  </div>
                </div>
                {/* <button
                  onClick={() => handleCloseRoom(selectedRoom._id)}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Close Chat
                </button> */}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p className="text-sm">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isTechnician = msg.senderType === "technician";
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${
                          isTechnician ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isTechnician
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-800 shadow-md"
                          }`}
                        >
                          {!isTechnician && (
                            <div className="text-xs font-semibold mb-1 text-blue-600">
                              {msg.senderName}
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                          <div
                            className={`text-xs mt-1 ${
                              isTechnician ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {formatTime(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response..."
                  disabled={sending}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sending ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          // No Chat Selected
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <svg
                className="w-20 h-20 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg font-medium">Select a chat to start</p>
              <p className="text-sm text-gray-400 mt-2">
                Choose a customer from the sidebar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
