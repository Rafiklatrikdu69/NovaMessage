import {User} from '../../models/user.model';
import { Conversation } from '../../models/conversation.model';
import { Message } from '../../models/message.model';

const getRandomStatus = (): 'online' | 'offline' | 'away' => {
  const statuses: ('online' | 'offline' | 'away')[] = ['online', 'offline', 'away'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const generateMockUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => {
    const uid = `user_${i + 1}`;
    return {
      uid,
      email: `user${i + 1}@example.com`,
      displayName: `User ${i + 1}`,
      photoURL: `https://i.pravatar.cc/150?u=${uid}`, // Avatar aléatoire
      status: getRandomStatus(),
      lastSeen: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 5000000000)),
      contacts: Array.from({ length: Math.floor(Math.random() * 5) }, () => `user_${Math.floor(Math.random() * count) + 1}`),
    };
  });
};


const getRandomConversationType = (): 'private' | 'group' => {
  const types: ('private' | 'group')[] = ['private', 'group'];
  return types[Math.floor(Math.random() * types.length)];
};

export const generateMockConversations = (count: number, userCount: number): Conversation[] => {
  return Array.from({ length: count }, (_, i) => {
    const id = `conv_${i + 1}`;
    const participantsCount = Math.floor(Math.random() * 3) + 2; // Au moins 2 participants

    // Génération des participants
    const participants = Array.from({ length: participantsCount }, () => `user_${Math.floor(Math.random() * userCount) + 1}`);

    return {
      id,
      participants,
      type: getRandomConversationType(),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 5000000000)),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
      lastMessage: {
        text: `Message de test ${i + 1}`,
        senderId: participants[Math.floor(Math.random() * participants.length)],
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
      },
      // Optionnels pour les conversations de groupe
      groupName: Math.random() > 0.5 ? `Group ${i + 1}` : undefined,
      groupPhoto: Math.random() > 0.5 ? `https://i.pravatar.cc/150?u=group_${i + 1}` : undefined,
      adminIds: Math.random() > 0.5 ? [participants[0]] : undefined, // Un admin dans le groupe
    };
  });
};


const getRandomMessageType = (): 'text' | 'image' | 'file' | 'audio' => {
  const types: ('text' | 'image' | 'file' | 'audio')[] = ['text', 'image', 'file', 'audio'];
  return types[Math.floor(Math.random() * types.length)];
};

const getRandomMessageStatus = (): 'sent' | 'delivered' | 'read' => {
  const statuses: ('sent' | 'delivered' | 'read')[] = ['sent', 'delivered', 'read'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const generateRandomContent = (type: 'text' | 'image' | 'file' | 'audio'): { type: 'text' | 'image' | 'file' | 'audio'; text?: string; fileUrl?: string; fileName?: string; fileSize?: number; mimeType?: string } => {
  switch (type) {
    case 'text':
      return { type, text: `Message de test de type ${type}` };
    case 'image':
      return { type, fileUrl: `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`, fileName: 'image.jpg', fileSize: 2048, mimeType: 'image/jpeg' };
    case 'file':
      return { type, fileUrl: `https://example.com/file${Math.floor(Math.random() * 1000)}.pdf`, fileName: 'document.pdf', fileSize: 1024, mimeType: 'application/pdf' };
    case 'audio':
      return { type, fileUrl: `https://example.com/audio${Math.floor(Math.random() * 1000)}.mp3`, fileName: 'audio.mp3', fileSize: 5120, mimeType: 'audio/mp3' };
    default:
      return { type }; // Ensures type is always defined
  }
};


export const generateMockMessages = (count: number, conversationIds: string[], userIds: string[]): {
  id: string;
  conversationId: string;
  senderId: string;
  content: {
    type: "text" | "image" | "file" | "audio";
    text?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string
  };
  timestamp: Date;
  readBy: { [p: string]: Date };
  status: "sent" | "delivered" | "read";
  reactions: { [p: string]: string } | undefined
}[] => {
  return Array.from({ length: count }, (_, i) => {
    const id = `message_${i + 1}`;
    const conversationId = conversationIds[Math.floor(Math.random() * conversationIds.length)];
    const senderId = userIds[Math.floor(Math.random() * userIds.length)];
    const type = getRandomMessageType();
    const content = generateRandomContent(type);
    const status = getRandomMessageStatus();

    return {
      id,
      conversationId,
      senderId,
      content,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
      readBy: {
        [userIds[Math.floor(Math.random() * userIds.length)]]: new Date(), // Un utilisateur lit le message
      },
      status,
      reactions: Math.random() > 0.5 ? { [userIds[Math.floor(Math.random() * userIds.length)]]: '😊' } : undefined, // Réaction aléatoire
    };
  });
};
