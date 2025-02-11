export interface Conversation {
  id: string;
  uid?:string;
  participants: string[]; // Array of user UIDs
  type: 'private' | 'group';
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Date;
  };
  // Pour les conversations de groupe
  groupName?: string;
  groupPhoto?: string;
  adminIds?: string[];
}
