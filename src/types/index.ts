export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  interests: string[];
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  senderId: string; // ID of the user who sent the message
}

export interface ChatConversation {
  id: string;
  user: UserProfile; // The other user in the conversation
  messages: ChatMessage[];
}