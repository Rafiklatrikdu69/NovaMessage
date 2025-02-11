export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  type: 'message' | 'groupInvite' | 'friendRequest';
  content: string;
  conversationId?: string;
  timestamp: Date;
  read: boolean;
}
