"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { MessageCircle, X, Send, Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { isTechnician } from "@/lib/utils";

interface Message {
  _id: string;
  senderType: string;
  senderName?: string;
  content: string;
  createdAt: string;
  isRead?: boolean;
}

interface ChatRoom {
  _id: string;
  customerName?: string;
}

export default function CustomerChat() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [latestMessage, setLatestMessage] = useState<Message | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    "default"
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const previousMessageCountRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
    // Create audio element for notification sound
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGmm98OScTgwOUKXh8LZjHAU5k9nyyXkrBSh+zPLaizsIHm3A8uihUhELTKXh8bllHgU2jdXxy3ouBSl/z/PajDsIG2/D9OekUREKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEKTKbh8bllHgU3j9fxy3ouBSh/zvLaizsIHG/E9OejUhEK");
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize chat room on component mount (ALWAYS, not just when open)
  useEffect(() => {
    if (!chatRoom && !loading) {
      initializeChatRoom();
    }
  }, []);

  const initializeChatRoom = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: "Customer" }),
      });

      if (!response.ok) {
        console.error("Failed to initialize chat:", response.status, response.statusText);
        return;
      }

      const data = await response.json();
      setChatRoom(data.chatRoom);
      await fetchMessages(data.chatRoom._id);
    } catch (error) {
      console.error("Error initializing chat:", error);
    } finally {
      setLoading(false);
    }
  };

  // Poll for new messages (even when chat is closed to show notifications)
  useEffect(() => {
    if (!chatRoom?._id) return;

    const interval = setInterval(() => {
      fetchMessages(chatRoom._id);
    }, 3000);

    return () => clearInterval(interval);
  }, [chatRoom, isOpen]);

  const fetchMessages = async (roomId: string): Promise<void> => {
    if (!roomId) return;

    try {
      const response = await fetch(
        `/api/chat/messages?chatRoomId=${roomId}&limit=100`
      );

      if (!response.ok) {
        console.error("Failed to fetch messages:", response.status, response.statusText);
        return;
      }

      const data = await response.json();
      const newMessages: Message[] = data.messages || [];

      // Check for new technician messages
      const technicianMessages = newMessages.filter(
        (msg) => msg.senderType === "technician"
      );

      if (technicianMessages.length > previousMessageCountRef.current) {
        const latestTechMessage = technicianMessages[technicianMessages.length - 1];

        // Only show notification if chat is closed
        if (!isOpen && latestTechMessage) {
          showNewMessageNotification(latestTechMessage);
        }
      }

      previousMessageCountRef.current = technicianMessages.length;
      setMessages(newMessages);

      const unread = newMessages.filter(
        (msg) => msg.senderType === "technician" && !msg.isRead
      ).length;

      setUnreadCount(unread);

      if (unread > 0 && isOpen) {
        await markMessagesAsRead(roomId);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const showNewMessageNotification = (message: Message): void => {
    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    // Show in-app notification
    setLatestMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);

    // Show browser notification if permitted
    if (notificationPermission === "granted") {
      new Notification("New message from Technical Support", {
        body: message.content,
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'><path d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z'/><circle cx='12' cy='12' r='3'/></svg>",
        tag: "chat-message",
      });
    }
  };

  const requestNotificationPermission = async (): Promise<void> => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const markMessagesAsRead = async (roomId: string): Promise<void> => {
    try {
      const response = await fetch("/api/chat/messages/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatRoomId: roomId,
          userType: "customer",
        }),
      });

      if (!response.ok) {
        console.error("Failed to mark messages as read:", response.status, response.statusText);
        return;
      }

      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!newMessage.trim() || !chatRoom || sending) return;

    setSending(true);

    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatRoomId: chatRoom._id,
          content: newMessage,
          senderType: "customer",
          senderName: "Customer",
        }),
      });

      if (!response.ok) {
        console.error("Failed to send message:", response.status, response.statusText);
        alert("Failed to send message. Please try again.");
        return;
      }

      setNewMessage("");
      await fetchMessages(chatRoom._id);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e as any).key === "Enter" && !(e as any).shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: string): string => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Clear notifications when chat is opened
  useEffect(() => {
    if (isOpen) {
      setShowNotification(false);
      setUnreadCount(0);
      if (chatRoom?._id) {
        markMessagesAsRead(chatRoom._id);
      }
    }
  }, [isOpen]);

  const { data: session, status } = useSession();

  if (status === "loading") return null;

  const isUserTechnician = isTechnician(session?.user?.email);

  if (!session || isUserTechnician) return null; // Hide chat for technicians or unauthenticated users

  return (
    <>
      {/* In-app notification toast */}
      {showNotification && latestMessage && !isOpen && (
        <div className="fixed top-6 right-6 bg-white rounded-lg shadow-2xl p-4 max-w-sm z-50 animate-slideDown border-l-4 border-blue-600">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900">Technical Support</h4>
                <button 
                  onClick={() => setShowNotification(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600">{latestMessage.content}</p>
              <button
                onClick={() => {
                  setIsOpen(true);
                  setShowNotification(false);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
              >
                View Message →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-50"
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
              <div>
                <h3 className="font-semibold">Technical Support</h3>
                <p className="text-xs text-blue-100">We're here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {notificationPermission === "default" && (
                <button
                  onClick={requestNotificationPermission}
                  className="hover:bg-blue-500 rounded-full p-1 transition-colors"
                  title="Enable notifications"
                >
                  <Bell className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-500 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Loading chat...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-center">
                <div>
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start a conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isCustomer = msg.senderType === "customer";
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isCustomer ? "justify-end" : "justify-start"} mb-2`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-[75%] ${
                        isCustomer
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 shadow rounded-bl-none"
                      }`}
                    >
                      {!isCustomer && (
                        <div className="text-xs font-semibold text-blue-600 mb-1">
                          {msg.senderName}
                        </div>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <div
                        className={`text-xs mt-1 ${
                          isCustomer ? "text-blue-200" : "text-gray-500"
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                        {isCustomer && msg.isRead && (
                          <span className="ml-1">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={sending || loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
              />
              <button
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim() || loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}