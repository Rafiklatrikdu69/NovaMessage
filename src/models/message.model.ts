export interface Message {
  id?: string;
  uid?:string;
  conversationId: string;
  senderId: string;
  content: {
    type?: 'text' | 'image' | 'file' | 'audio'| undefined;
    text?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  };
  timestamp: string;
  writeBy: string;
  readBy?: {
    [userId: string]: Date;
  };
  status?: 'sent' | 'delivered' | 'read';
  reactions?: {
    [userId: string]: string; // emoji
  };
}
